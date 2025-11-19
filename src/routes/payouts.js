const express = require('express');
const admin = require('firebase-admin');
const { getBankCode } = require('../../escrow-backend/bankCodes');

const router = express.Router();

// Get all payout requests (admin only)
router.get('/requests', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let payoutsQuery = admin.firestore().collection('payouts')
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));
    
    if (status && status !== 'all') {
      payoutsQuery = payoutsQuery.where('status', '==', status);
    }
    
    const snapshot = await payoutsQuery.get();
    const payouts = [];
    
    // Fetch seller details for each payout
    for (const doc of snapshot.docs) {
      const payoutData = { id: doc.id, ...doc.data() };
      
      // Get seller information
      const sellerDoc = await admin.firestore().collection('sellers').doc(payoutData.sellerId).get();
      if (sellerDoc.exists) {
        const sellerData = sellerDoc.data();
        payoutData.sellerInfo = {
          displayName: sellerData.displayName || sellerData.businessName || 'Unknown',
          email: sellerData.email || 'No email',
          businessName: sellerData.businessName || ''
        };
      } else {
        payoutData.sellerInfo = { displayName: 'Unknown Seller', email: 'N/A', businessName: '' };
      }
      
      payouts.push(payoutData);
    }
    
    res.json({
      success: true,
      data: payouts,
      total: payouts.length
    });
    
  } catch (error) {
    console.error('Error fetching payouts:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payouts'
    });
  }
});

// Process a payout request (admin only)
router.post('/process', async (req, res) => {
  try {
    const { payoutId, adminId } = req.body;
    
    if (!payoutId || !adminId) {
      return res.status(400).json({
        success: false,
        message: 'Missing payoutId or adminId'
      });
    }
    
    // Verify admin
    const adminDoc = await admin.firestore().collection('users').doc(adminId).get();
    if (!adminDoc.exists || !['admin', 'superadmin'].includes(adminDoc.data().role)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Admin access required'
      });
    }
    
    // Get payout details
    const payoutDoc = await admin.firestore().collection('payouts').doc(payoutId).get();
    if (!payoutDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Payout not found'
      });
    }
    
    const payoutData = payoutDoc.data();
    if (payoutData.status !== 'requested') {
      return res.status(400).json({
        success: false,
        message: 'Payout already processed or not in requested status'
      });
    }
    
    // Get bank code using our mapping function
    const bankCode = getBankCode(payoutData.bankDetails.bankName);
    if (!bankCode) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported bank: ' + payoutData.bankDetails.bankName + '. Please check the bank name spelling.'
      });
    }
    
    // Create transfer recipient with Paystack
    const recipientResponse = await fetch('https://api.paystack.co/transferrecipient', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'nuban',
        name: payoutData.bankDetails.accountName,
        account_number: payoutData.bankDetails.accountNumber,
        bank_code: bankCode,
        currency: 'NGN'
      })
    });
    
    const recipientData = await recipientResponse.json();
    if (!recipientData.status) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create transfer recipient: ' + recipientData.message
      });
    }
    
    const recipientCode = recipientData.data.recipient_code;
    
    // Initiate transfer
    const transferResponse = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: 'balance',
        amount: payoutData.amount * 100, // Convert to kobo
        recipient: recipientCode,
        reason: 'Blorb Marketplace Payout - ' + payoutId,
        reference: payoutId
      })
    });
    
    const transferData = await transferResponse.json();
    if (!transferData.status) {
      return res.status(400).json({
        success: false,
        message: 'Transfer failed: ' + transferData.message
      });
    }
    
    // Update payout status
    await admin.firestore().collection('payouts').doc(payoutId).update({
      status: 'processed',
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      transferReference: transferData.data.reference,
      transferId: transferData.data.id,
      processedBy: adminId
    });
    
    // Update transaction
    const transactionsQuery = await admin.firestore().collection('transactions')
      .where('payoutId', '==', payoutId)
      .limit(1)
      .get();
    
    if (!transactionsQuery.empty) {
      const transactionDoc = transactionsQuery.docs[0];
      await admin.firestore().collection('transactions').doc(transactionDoc.id).update({
        status: 'completed',
        description: transferData.data.reason,
        metadata: {
          ...transactionDoc.data().metadata,
          transferReference: transferData.data.reference,
          transferId: transferData.data.id
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Payout processed successfully',
      data: {
        payoutId,
        transferReference: transferData.data.reference,
        amount: payoutData.amount
      }
    });
    
  } catch (error) {
    console.error('Error processing payout:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process payout'
    });
  }
});

// Get payout statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    const payoutsCollection = admin.firestore().collection('payouts');
    
    // Get total amounts by status
    const requestedSnapshot = await payoutsCollection.where('status', '==', 'requested').get();
    const processedSnapshot = await payoutsCollection.where('status', '==', 'processed').get();
    const completedSnapshot = await payoutsCollection.where('status', '==', 'completed').get();
    const failedSnapshot = await payoutsCollection.where('status', '==', 'failed').get();
    
    const calculateTotal = (snapshot) => {
      return snapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
    };
    
    const stats = {
      requested: {
        count: requestedSnapshot.size,
        totalAmount: calculateTotal(requestedSnapshot)
      },
      processed: {
        count: processedSnapshot.size,
        totalAmount: calculateTotal(processedSnapshot)
      },
      completed: {
        count: completedSnapshot.size,
        totalAmount: calculateTotal(completedSnapshot)
      },
      failed: {
        count: failedSnapshot.size,
        totalAmount: calculateTotal(failedSnapshot)
      },
      totalPayouts: {
        count: requestedSnapshot.size + processedSnapshot.size + completedSnapshot.size + failedSnapshot.size,
        totalAmount: calculateTotal(requestedSnapshot) + calculateTotal(processedSnapshot) + 
                     calculateTotal(completedSnapshot) + calculateTotal(failedSnapshot)
      }
    };
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Error fetching payout stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payout statistics'
    });
  }
});

// Get single payout details (admin only)
router.get('/:payoutId', async (req, res) => {
  try {
    const { payoutId } = req.params;
    
    const payoutDoc = await admin.firestore().collection('payouts').doc(payoutId).get();
    if (!payoutDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Payout not found'
      });
    }
    
    const payoutData = { id: payoutId, ...payoutDoc.data() };
    
    // Get seller information
    const sellerDoc = await admin.firestore().collection('sellers').doc(payoutData.sellerId).get();
    if (sellerDoc.exists) {
      const sellerData = sellerDoc.data();
      payoutData.sellerInfo = {
        displayName: sellerData.displayName || sellerData.businessName || 'Unknown',
        email: sellerData.email || 'No email',
        businessName: sellerData.businessName || '',
        phone: sellerData.phone || 'N/A'
      };
    }
    
    // Get related transaction
    const transactionsQuery = await admin.firestore().collection('transactions')
      .where('payoutId', '==', payoutId)
      .limit(1)
      .get();
    
    if (!transactionsQuery.empty) {
      payoutData.transaction = transactionsQuery.docs[0].data();
    }
    
    res.json({
      success: true,
      data: payoutData
    });
    
  } catch (error) {
    console.error('Error fetching payout details:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payout details'
    });
  }
});

module.exports = router;

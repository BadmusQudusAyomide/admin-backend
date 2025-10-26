const router = require('express').Router();
const { admin } = require('../config/firebaseAdmin');
const { requireAdmin } = require('../middleware/requireAdmin');

router.get('/', requireAdmin, async (req, res) => {
  try {
    const { q, status, limit = '50', page = '1' } = req.query;
    const db = admin.firestore();
    
    let query = db.collection('sellers').orderBy('createdAt', 'desc');
    
    // Apply status filter
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    
    const snap = await query.limit(1000).get();
    let sellers = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
        joinedAt: data.joinedAt?.toDate?.() || data.createdAt?.toDate?.() || null,
        lastActive: data.lastActive?.toDate?.() || null,
      };
    });

    // Apply text search if provided
    if (q && q.trim()) {
      const searchTerm = q.toLowerCase().trim();
      sellers = sellers.filter(s => 
        s.businessName?.toLowerCase().includes(searchTerm) ||
        s.email?.toLowerCase().includes(searchTerm) ||
        s.phone?.toLowerCase().includes(searchTerm)
      );
    }

    const p = Number(page) || 1;
    const l = Number(limit) || 50;
    const start = (p - 1) * l;
    const end = start + l;
    const pageItems = sellers.slice(start, end);

    res.json({ 
      success: true, 
      data: pageItems, 
      total: sellers.length, 
      page: p, 
      limit: l 
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/:sellerId/approve', requireAdmin, async (req, res) => {
  try {
    const { sellerId } = req.params;
    const db = admin.firestore();
    const ref = db.collection('sellers').doc(sellerId);
    const snap = await ref.get();
    
    if (!snap.exists) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    await ref.update({
      status: 'active',
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      approvedBy: req.user.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, message: 'Seller approved successfully' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/:sellerId/suspend', requireAdmin, async (req, res) => {
  try {
    const { sellerId } = req.params;
    const db = admin.firestore();
    const ref = db.collection('sellers').doc(sellerId);
    const snap = await ref.get();
    
    if (!snap.exists) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    await ref.update({
      status: 'suspended',
      suspendedAt: admin.firestore.FieldValue.serverTimestamp(),
      suspendedBy: req.user.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, message: 'Seller suspended successfully' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;

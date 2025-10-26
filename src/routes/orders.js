const router = require('express').Router();
const axios = require('axios');
const { admin } = require('../config/firebaseAdmin');
const { requireAdmin } = require('../middleware/requireAdmin');

router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status, stage, sellerId, buyerId, limit = '50', page = '1' } = req.query;
    const db = admin.firestore();
    const snap = await db.collection('orders').orderBy('createdAt', 'desc').limit(500).get();
    let orders = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
        paidAt: data.paidAt?.toDate?.() || null,
        releasedAt: data.releasedAt?.toDate?.() || null,
      };
    });

    if (status) orders = orders.filter(o => o.status === status || o.paymentStatus === status);
    if (buyerId) orders = orders.filter(o => o.buyerId === buyerId);
    if (sellerId) orders = orders.filter(o => Array.isArray(o.sellerIds) && o.sellerIds.includes(sellerId));

    if (stage === 'pending_dispatch') {
      orders = orders.filter(o => {
        const hasAcceptedArray = Array.isArray(o.acceptedSellerIds) && o.acceptedSellerIds.length > 0;
        const hasAcceptedStatus = o.sellerStatuses && typeof o.sellerStatuses === 'object' && Object.values(o.sellerStatuses).some(s => s && (s.status === 'accepted' || s.status === 'approved'));
        return o.paymentStatus === 'paid' && o.deliveryStatus === 'pending' && (hasAcceptedArray || hasAcceptedStatus);
      });
    }

    const p = Number(page) || 1; const l = Number(limit) || 50;
    const start = (p - 1) * l; const end = start + l;
    const pageItems = orders.slice(start, end);

    res.json({ success: true, data: pageItems, total: orders.length, page: p, limit: l });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/:orderId/mark-delivered', requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const db = admin.firestore();
    const ref = db.collection('orders').doc(orderId);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ success: false, message: 'Order not found' });

    await ref.update({
      deliveryStatus: 'delivered',
      deliveredAt: admin.firestore.FieldValue.serverTimestamp(),
      deliveredBy: req.user.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, message: 'Order marked as delivered' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/:orderId/release', requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const escrowUrl = process.env.ESCROW_BACKEND_URL;
    if (!escrowUrl) return res.status(500).json({ success: false, message: 'ESCROW_BACKEND_URL not configured' });

    const resp = await axios.post(`${escrowUrl}/escrow/release`, { orderId, adminId: req.user.uid });
    res.status(resp.status).json(resp.data);
  } catch (e) {
    const status = e.response?.status || 500;
    const data = e.response?.data || { success: false, message: e.message };
    res.status(status).json(data);
  }
});

module.exports = router;

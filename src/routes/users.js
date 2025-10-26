const router = require('express').Router();
const { admin } = require('../config/firebaseAdmin');
const { requireAdmin } = require('../middleware/requireAdmin');

router.get('/', requireAdmin, async (req, res) => {
  try {
    const { q, role, status, limit = '50', page = '1' } = req.query;
    const db = admin.firestore();
    let ref = db.collection('users');
    const snap = await ref.orderBy('createdAt', 'desc').limit(500).get();
    let users = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.get('createdAt')?.toDate?.() || null, lastLogin: d.get('lastLogin')?.toDate?.() || null }));

    if (q) {
      const s = String(q).toLowerCase();
      users = users.filter(u => (u.email || '').toLowerCase().includes(s) || (u.name || '').toLowerCase().includes(s));
    }
    if (role && role !== 'all') users = users.filter(u => u.role === role);
    if (status && status !== 'all') users = users.filter(u => (status === 'active' ? u.isActive !== false : u.isActive === false));

    const p = Number(page) || 1; const l = Number(limit) || 50;
    const start = (p - 1) * l; const end = start + l;
    const pageItems = users.slice(start, end);

    res.json({ success: true, data: pageItems, total: users.length, page: p, limit: l });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;

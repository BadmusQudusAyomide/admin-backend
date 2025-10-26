const router = require('express').Router();
const { admin } = require('../config/firebaseAdmin');
const { requireAdmin } = require('../middleware/requireAdmin');

router.get('/', requireAdmin, async (req, res) => {
  try {
    const { limit = '50', page = '1' } = req.query;
    const db = admin.firestore();
    
    const snap = await db.collection('categories')
      .orderBy('name', 'asc')
      .limit(1000)
      .get();
      
    let categories = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
      };
    });

    const p = Number(page) || 1;
    const l = Number(limit) || 50;
    const start = (p - 1) * l;
    const end = start + l;
    const pageItems = categories.slice(start, end);

    res.json({ 
      success: true, 
      data: pageItems, 
      total: categories.length, 
      page: p, 
      limit: l 
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;

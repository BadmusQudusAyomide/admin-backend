const router = require('express').Router();
const { admin } = require('../config/firebaseAdmin');
const { requireAdmin } = require('../middleware/requireAdmin');

router.get('/', requireAdmin, async (req, res) => {
  try {
    const { q, category, status, sellerId, limit = '50', page = '1' } = req.query;
    const db = admin.firestore();
    
    let query = db.collection('products').orderBy('createdAt', 'desc');
    
    // Apply filters
    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    if (sellerId) {
      query = query.where('sellerId', '==', sellerId);
    }
    
    const snap = await query.limit(1000).get();
    let products = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
      };
    });

    // Apply text search if provided
    if (q && q.trim()) {
      const searchTerm = q.toLowerCase().trim();
      products = products.filter(p => 
        p.name?.toLowerCase().includes(searchTerm) ||
        p.description?.toLowerCase().includes(searchTerm) ||
        p.category?.toLowerCase().includes(searchTerm)
      );
    }

    const p = Number(page) || 1;
    const l = Number(limit) || 50;
    const start = (p - 1) * l;
    const end = start + l;
    const pageItems = products.slice(start, end);

    res.json({ 
      success: true, 
      data: pageItems, 
      total: products.length, 
      page: p, 
      limit: l 
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;

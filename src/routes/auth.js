const router = require('express').Router();
const { admin } = require('../config/firebaseAdmin');
const { requireAdmin } = require('../middleware/requireAdmin');

router.get('/me', requireAdmin, async (req, res) => {
  try {
    const db = admin.firestore();
    const snap = await db.collection('users').doc(req.user.uid).get();
    const profile = snap.exists ? snap.data() : {};
    res.json({ success: true, data: { uid: req.user.uid, email: req.user.email, role: profile.role || null, profile } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;

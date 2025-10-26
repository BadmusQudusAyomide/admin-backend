const { admin } = require('../config/firebaseAdmin');

async function verifyToken(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) throw new Error('Missing Authorization header');
  const decoded = await admin.auth().verifyIdToken(token);
  return decoded;
}

async function requireAdmin(req, res, next) {
  try {
    const decoded = await verifyToken(req);
    req.user = decoded;
    const db = admin.firestore();
    const snap = await db.collection('users').doc(decoded.uid).get();
    const role = snap.exists ? snap.data().role : null;
    if (role === 'admin' || role === 'superadmin') {
      req.userRole = role;
      return next();
    }
    return res.status(403).json({ success: false, message: 'Admin privileges required' });
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message || 'Unauthorized' });
  }
}

module.exports = { requireAdmin };

const admin = require('firebase-admin');
const path = require('path');

let initialized = false;

function initializeAdmin() {
  if (initialized) return admin;
  if (admin.apps.length) { initialized = true; return admin; }
  try {
    const credsPathEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credsPathEnv && credsPathEnv.endsWith('.json')) {
      let fullPath = credsPathEnv;
      if (!path.isAbsolute(fullPath)) {
        fullPath = path.resolve(process.cwd(), fullPath);
      }
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const serviceAccount = require(fullPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      admin.initializeApp(); // Use ADC if configured
    }
    initialized = true;
    console.log('Firebase Admin initialized');
  } catch (e) {
    console.error('Failed to initialize Firebase Admin:', e.message);
    throw e;
  }
  return admin;
}

module.exports = { admin, initializeAdmin };

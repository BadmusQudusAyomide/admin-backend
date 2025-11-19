const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { initializeAdmin } = require('./config/firebaseAdmin');

initializeAdmin();

const app = express();
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

const originsEnv = process.env.ADMIN_FRONTEND_ORIGINS || process.env.ADMIN_FRONTEND_ORIGIN || '';
const allowedOrigins = originsEnv
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true,
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/orders', require('./routes/orders'));
app.use('/products', require('./routes/products'));
app.use('/categories', require('./routes/categories'));
app.use('/sellers', require('./routes/sellers'));
app.use('/payouts', require('./routes/payouts'));

module.exports = app;

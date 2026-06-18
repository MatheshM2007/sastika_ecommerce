require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');
const bannerRoutes = require('./routes/banner.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Dynamic CORS for local & production
const allowedOrigins = [
  'http://localhost:3000',
  'https://sastika-ecommerce.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // allow all in dev, restrict in production
        if (process.env.NODE_ENV === 'production') {
          callback(null, false);
        } else {
          callback(null, true);
        }
      }
    },
    credentials: true,
  })
);
app.use(compression());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Sastika API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Sastika API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/banners', bannerRoutes);

app.use(errorHandler);

// Listen on Render/VPS — skip listening if running as Vercel serverless
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Sastika API running on http://localhost:${PORT}`);
  });
}

module.exports = app;

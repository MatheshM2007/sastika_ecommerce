const pool = require('../config/db');

const getCart = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT c.id, c.product_id, c.quantity, p.title, p.price, p.mrp, p.stock, p.image_url, p.category
     FROM cart c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1 AND p.is_active = true`,
    [req.user.id]
  );

  const items = rows.map((r) => ({
    id: r.id,
    product_id: r.product_id,
    quantity: r.quantity,
    title: r.title,
    price: parseFloat(r.price),
    mrp: parseFloat(r.mrp),
    stock: r.stock,
    image_url: r.image_url,
    category: r.category,
    line_total: parseFloat(r.price) * r.quantity,
  }));

  const subtotal = items.reduce((sum, i) => sum + i.line_total, 0);
  const deliveryFee = subtotal >= 299 ? 0 : 49;

  res.json({
    success: true,
    data: { items, subtotal, deliveryFee, total: subtotal + deliveryFee },
  });
};

const addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;

  const product = await pool.query(
    'SELECT id, stock FROM products WHERE id = $1 AND is_active = true',
    [product_id]
  );
  if (!product.rows.length) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  if (product.rows[0].stock < quantity) {
    return res.status(400).json({ success: false, message: 'Insufficient stock' });
  }

  await pool.query(
    `INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = LEAST(cart.quantity + EXCLUDED.quantity, $4)`,
    [req.user.id, product_id, quantity, product.rows[0].stock]
  );

  res.status(201).json({ success: true, message: 'Added to cart' });
};

const updateCart = async (req, res) => {
  const { product_id, quantity } = req.body;

  const product = await pool.query('SELECT stock FROM products WHERE id = $1', [product_id]);
  if (!product.rows.length) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  if (product.rows[0].stock < quantity) {
    return res.status(400).json({ success: false, message: 'Insufficient stock' });
  }

  const { rowCount } = await pool.query(
    'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
    [quantity, req.user.id, product_id]
  );

  if (!rowCount) {
    return res.status(404).json({ success: false, message: 'Cart item not found' });
  }

  res.json({ success: true, message: 'Cart updated' });
};

const removeFromCart = async (req, res) => {
  const productId = req.body.product_id || req.query.product_id;

  await pool.query('DELETE FROM cart WHERE user_id = $1 AND product_id = $2', [
    req.user.id,
    productId,
  ]);

  res.json({ success: true, message: 'Removed from cart' });
};

module.exports = { getCart, addToCart, updateCart, removeFromCart };

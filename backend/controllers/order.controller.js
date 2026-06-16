const pool = require('../config/db');
const { createRazorpayOrder } = require('../services/razorpay');

const generateTracking = () =>
  'SST' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();

const createOrder = async (req, res) => {
  const { shipping_address } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const cartResult = await client.query(
      `SELECT c.product_id, c.quantity, p.price, p.stock, p.title
       FROM cart c JOIN products p ON p.id = c.product_id
       WHERE c.user_id = $1 AND p.is_active = true FOR UPDATE OF p`,
      [req.user.id]
    );

    if (!cartResult.rows.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let subtotal = 0;
    for (const item of cartResult.rows) {
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.title}`,
        });
      }
      subtotal += parseFloat(item.price) * item.quantity;
    }

    const deliveryFee = subtotal >= 299 ? 0 : 49;
    const totalAmount = subtotal + deliveryFee;

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, status, payment_status, shipping_address, tracking_number)
       VALUES ($1, $2, 'Order Placed', 'pending', $3, $4)
       RETURNING *`,
      [req.user.id, totalAmount, JSON.stringify(shipping_address), generateTracking()]
    );

    const order = orderResult.rows[0];

    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [
        item.quantity,
        item.product_id,
      ]);
    }

    await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);

    let razorpayOrder = null;
    const paymentMode = process.env.PAYMENT_MODE || 'razorpay';

    if (paymentMode === 'cod') {
      await client.query(
        `UPDATE orders SET payment_status = 'paid' WHERE id = $1`,
        [order.id]
      );
    } else {
      razorpayOrder = await createRazorpayOrder(totalAmount, `order_${order.id}`);
      await client.query(`UPDATE orders SET razorpay_order_id = $1 WHERE id = $2`, [
        razorpayOrder.id,
        order.id,
      ]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      data: {
        order: { ...order, total_amount: totalAmount },
        razorpay: razorpayOrder
          ? {
              order_id: razorpayOrder.id,
              amount: razorpayOrder.amount,
              currency: razorpayOrder.currency,
              key_id: process.env.RAZORPAY_KEY_ID,
            }
          : null,
        payment_mode: paymentMode,
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getOrders = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT o.*,
      COALESCE(
        json_agg(json_build_object(
          'id', oi.id, 'product_id', oi.product_id, 'quantity', oi.quantity,
          'price', oi.price, 'title', p.title, 'image_url', p.image_url
        )) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) AS items
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.id
     LEFT JOIN products p ON p.id = oi.product_id
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [req.user.id]
  );

  res.json({ success: true, data: { orders: rows } });
};

const getOrderById = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT o.*,
      COALESCE(
        json_agg(json_build_object(
          'id', oi.id, 'product_id', oi.product_id, 'quantity', oi.quantity,
          'price', oi.price, 'title', p.title, 'image_url', p.image_url
        )) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) AS items
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.id
     LEFT JOIN products p ON p.id = oi.product_id
     WHERE o.id = $1 AND o.user_id = $2
     GROUP BY o.id`,
    [req.params.id, req.user.id]
  );

  if (!rows.length) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, data: { order: rows[0] } });
};

const updateOrderStatus = async (req, res) => {
  const { order_id, status, tracking_number } = req.body;

  const { rows } = await pool.query(
    `UPDATE orders SET status = $1,
      tracking_number = COALESCE($2, tracking_number)
     WHERE id = $3 RETURNING *`,
    [status, tracking_number || null, order_id]
  );

  if (!rows.length) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, data: { order: rows[0] } });
};

const getAllOrdersAdmin = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT o.*, u.name AS user_name, u.email AS user_email,
      COALESCE(
        json_agg(json_build_object(
          'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price,
          'title', p.title
        )) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) AS items
     FROM orders o
     JOIN users u ON u.id = o.user_id
     LEFT JOIN order_items oi ON oi.order_id = o.id
     LEFT JOIN products p ON p.id = oi.product_id
     GROUP BY o.id, u.name, u.email
     ORDER BY o.created_at DESC`
  );

  res.json({ success: true, data: { orders: rows } });
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrdersAdmin,
};

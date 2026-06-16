const pool = require('../config/db');

const LOW_STOCK = parseInt(process.env.LOW_STOCK_THRESHOLD || '10', 10);

const dashboard = async (req, res) => {
  const [users, orders, revenue, recentOrders, lowStock] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS count FROM users'),
    pool.query('SELECT COUNT(*)::int AS count FROM orders'),
    pool.query(
      `SELECT COALESCE(SUM(total_amount), 0)::float AS total FROM orders WHERE payment_status = 'paid'`
    ),
    pool.query(
      `SELECT o.id, o.total_amount, o.status, o.payment_status, o.created_at, u.name AS user_name
       FROM orders o JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC LIMIT 10`
    ),
    pool.query(
      `SELECT id, title, stock, category, price FROM products
       WHERE stock < $1 AND is_active = true ORDER BY stock ASC LIMIT 10`,
      [LOW_STOCK]
    ),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers: users.rows[0].count,
      totalOrders: orders.rows[0].count,
      totalRevenue: revenue.rows[0].total,
      recentOrders: recentOrders.rows,
      lowStockProducts: lowStock.rows,
    },
  });
};

const analytics = async (req, res) => {
  const days = parseInt(req.query.days || '7', 10);

  const [ordersByDay, revenueByDay, topCategories] = await Promise.all([
    pool.query(
      `SELECT DATE(created_at) AS date, COUNT(*)::int AS orders
       FROM orders WHERE created_at >= NOW() - ($1 || ' days')::interval
       GROUP BY DATE(created_at) ORDER BY date`,
      [days]
    ),
    pool.query(
      `SELECT DATE(created_at) AS date, COALESCE(SUM(total_amount), 0)::float AS revenue
       FROM orders WHERE payment_status = 'paid' AND created_at >= NOW() - ($1 || ' days')::interval
       GROUP BY DATE(created_at) ORDER BY date`,
      [days]
    ),
    pool.query(
      `SELECT p.category, COUNT(oi.id)::int AS sales
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       GROUP BY p.category ORDER BY sales DESC LIMIT 5`
    ),
  ]);

  res.json({
    success: true,
    data: {
      ordersByDay: ordersByDay.rows,
      revenueByDay: revenueByDay.rows,
      topCategories: topCategories.rows,
      days,
    },
  });
};

const listUsers = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC`
  );
  res.json({ success: true, data: { users: rows } });
};

const updateUser = async (req, res) => {
  const { is_active, role } = req.body;
  const { id } = req.params;

  if (parseInt(id, 10) === req.user.id) {
    return res.status(400).json({ success: false, message: 'Cannot modify your own account' });
  }

  const { rows } = await pool.query(
    `UPDATE users SET
      is_active = COALESCE($1, is_active),
      role = COALESCE($2, role)
     WHERE id = $3 RETURNING id, name, email, role, is_active, created_at`,
    [is_active, role, id]
  );

  if (!rows.length) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({ success: true, data: { user: rows[0] } });
};

module.exports = { dashboard, analytics, listUsers, updateUser };

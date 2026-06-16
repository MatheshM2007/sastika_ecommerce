const pool = require('../config/db');
const { uploadImage } = require('../services/cloudinary');

const listProducts = async (req, res) => {
  const { search, category, page, limit, sort } = req.query;
  const offset = (page - 1) * limit;

  const conditions = ['is_active = true'];
  const params = [];
  let idx = 1;

  if (search) {
    conditions.push(`(title ILIKE $${idx} OR description ILIKE $${idx})`);
    params.push(`%${search}%`);
    idx++;
  }

  if (category) {
    conditions.push(`category = $${idx}`);
    params.push(category);
    idx++;
  }

  const where = conditions.join(' AND ');

  let orderBy = 'created_at DESC';
  if (sort === 'price_asc') orderBy = 'price ASC';
  if (sort === 'price_desc') orderBy = 'price DESC';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM products WHERE ${where}`,
    params
  );

  params.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT id, title, description, price, mrp, stock, category, image_url, created_at
     FROM products WHERE ${where}
     ORDER BY ${orderBy}
     LIMIT $${idx} OFFSET $${idx + 1}`,
    params
  );

  res.json({
    success: true,
    data: {
      products: rows,
      pagination: {
        page,
        limit,
        total: countResult.rows[0].total,
        totalPages: Math.ceil(countResult.rows[0].total / limit),
      },
    },
  });
};

const getProduct = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, title, description, price, mrp, stock, category, image_url, is_active, created_at
     FROM products WHERE id = $1`,
    [req.params.id]
  );

  if (!rows.length) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, data: { product: rows[0] } });
};

const parseProductBody = (body) => ({
  title: body.title,
  description: body.description,
  price: body.price !== undefined ? Number(body.price) : undefined,
  mrp: body.mrp !== undefined ? Number(body.mrp) : undefined,
  stock: body.stock !== undefined ? parseInt(body.stock, 10) : undefined,
  category: body.category,
  is_active: body.is_active === undefined ? undefined : body.is_active === true || body.is_active === 'true',
});

const createProduct = async (req, res) => {
  let imageUrl = req.body.image_url || null;
  if (req.file) {
    imageUrl = await uploadImage(req.file);
  }

  const { title, description, price, mrp, stock, category, is_active } = parseProductBody(req.body);

  const { rows } = await pool.query(
    `INSERT INTO products (title, description, price, mrp, stock, category, image_url, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, true))
     RETURNING *`,
    [title, description, price, mrp, stock, category, imageUrl, is_active]
  );

  res.status(201).json({ success: true, data: { product: rows[0] } });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const existing = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  if (!existing.rows.length) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  let imageUrl = req.body.image_url ?? existing.rows[0].image_url;
  if (req.file) {
    imageUrl = await uploadImage(req.file);
  }

  const parsed = parseProductBody(req.body);
  const prev = existing.rows[0];

  const { rows } = await pool.query(
    `UPDATE products SET
      title = $1, description = $2, price = $3, mrp = $4, stock = $5,
      category = $6, image_url = $7, is_active = $8
     WHERE id = $9 RETURNING *`,
    [
      parsed.title ?? prev.title,
      parsed.description ?? prev.description,
      parsed.price ?? prev.price,
      parsed.mrp ?? prev.mrp,
      parsed.stock ?? prev.stock,
      parsed.category ?? prev.category,
      imageUrl,
      parsed.is_active ?? prev.is_active,
      id,
    ]
  );

  res.json({ success: true, data: { product: rows[0] } });
};

const deleteProduct = async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
  if (!rowCount) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted' });
};

const listAllProductsAdmin = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  res.json({ success: true, data: { products: rows } });
};

const getCategories = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT DISTINCT category FROM products WHERE is_active = true ORDER BY category`
  );
  res.json({ success: true, data: { categories: rows.map((r) => r.category) } });
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listAllProductsAdmin,
  getCategories,
};

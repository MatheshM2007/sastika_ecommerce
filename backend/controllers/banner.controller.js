const pool = require('../config/db');

const listActiveBanners = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, title, subtitle, image_url, link_url, sort_order
     FROM banners WHERE is_active = true ORDER BY sort_order ASC, created_at DESC`
  );
  res.json({ success: true, data: { banners: rows } });
};

const listAllBanners = async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM banners ORDER BY sort_order ASC, created_at DESC'
  );
  res.json({ success: true, data: { banners: rows } });
};

const createBanner = async (req, res) => {
  const { title, subtitle, image_url, link_url, sort_order } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO banners (title, subtitle, image_url, link_url, sort_order)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title || '', subtitle || '', image_url || '', link_url || '/products', sort_order || 0]
  );
  res.status(201).json({ success: true, data: { banner: rows[0] } });
};

const updateBanner = async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, image_url, link_url, is_active, sort_order } = req.body;

  const existing = await pool.query('SELECT * FROM banners WHERE id = $1', [id]);
  if (!existing.rows.length) {
    return res.status(404).json({ success: false, message: 'Banner not found' });
  }

  const prev = existing.rows[0];
  const { rows } = await pool.query(
    `UPDATE banners SET
      title = $1, subtitle = $2, image_url = $3, link_url = $4,
      is_active = $5, sort_order = $6, updated_at = NOW()
     WHERE id = $7 RETURNING *`,
    [
      title ?? prev.title,
      subtitle ?? prev.subtitle,
      image_url ?? prev.image_url,
      link_url ?? prev.link_url,
      is_active !== undefined ? is_active : prev.is_active,
      sort_order ?? prev.sort_order,
      id,
    ]
  );
  res.json({ success: true, data: { banner: rows[0] } });
};

const deleteBanner = async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM banners WHERE id = $1', [req.params.id]);
  if (!rowCount) {
    return res.status(404).json({ success: false, message: 'Banner not found' });
  }
  res.json({ success: true, message: 'Banner deleted' });
};

module.exports = { listActiveBanners, listAllBanners, createBanner, updateBanner, deleteBanner };
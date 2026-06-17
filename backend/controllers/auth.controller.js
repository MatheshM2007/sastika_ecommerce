const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const hashed = await bcrypt.hash(password, 12);
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'customer')
     RETURNING id, name, email, role, created_at`,
    [name, email, hashed]
  );

  const user = rows[0];
  const token = signToken(user);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { user, token },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const { rows } = await pool.query(
    'SELECT id, name, email, password, role, is_active FROM users WHERE email = $1',
    [email]
  );

  if (!rows.length) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const user = rows[0];
  if (!user.is_active) {
    return res.status(403).json({ success: false, message: 'Account is deactivated' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  delete user.password;
  const token = signToken(user);

  res.json({
    success: true,
    message: 'Login successful',
    data: { user, token },
  });
};

const profile = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};

const updateProfile = async (req, res) => {
  const { name } = req.body;
  if (!name || name.length < 2) {
    return res.status(400).json({ success: false, message: 'Valid name is required' });
  }

  const { rows } = await pool.query(
    'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, role',
    [name, req.user.id]
  );

  res.json({ success: true, data: { user: rows[0] } });
};

const supabaseAuth = async (req, res) => {
  const { email, name, phone } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // Check if user exists
  const existing = await pool.query('SELECT id, name, email, role, is_active FROM users WHERE email = $1', [email]);

  let user;
  if (existing.rows.length) {
    user = existing.rows[0];
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }
    // Update name if provided
    if (name && name !== user.name) {
      const { rows } = await pool.query(
        'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, role',
        [name, user.id]
      );
      user = rows[0];
    }
  } else {
    // Create new user
    const displayName = name || (phone ? `User_${phone.slice(-4)}` : email.split('@')[0]);
    // Generate a random password for social login users
    const randomPassword = await bcrypt.hash(Math.random().toString(36), 12);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'customer')
       RETURNING id, name, email, role`,
      [displayName, email, randomPassword]
    );
    user = rows[0];
  }

  const token = signToken(user);
  res.json({
    success: true,
    message: 'Authentication successful',
    data: { user, token },
  });
};

module.exports = { register, login, profile, updateProfile, supabaseAuth };
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function seed() {
  const adminHash = await bcrypt.hash('Admin@123', 12);
  const customerHash = await bcrypt.hash('Customer@123', 12);

  await pool.query(
    `INSERT INTO users (name, email, password, role) VALUES
     ('Sastika Admin', 'admin@sastika.in', $1, 'admin'),
     ('Demo Customer', 'customer@sastika.in', $2, 'customer')
     ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password`,
    [adminHash, customerHash]
  );

  console.log('Users seeded: admin@sastika.in / Admin@123, customer@sastika.in / Customer@123');
  await pool.end();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

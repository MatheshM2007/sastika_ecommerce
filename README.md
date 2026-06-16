# Sastika E-commerce

Meesho-style Indian value marketplace — ethnic wear, kurtis, sarees & more at wholesale prices. Built with **Next.js 14**, **Express**, **PostgreSQL**, **JWT auth**, **Razorpay**, and **Cloudinary**.

## Project structure

```
sastika_ecommerce/
├── database/          # schema.sql, seed.sql, migrate.sh
├── backend/           # Express REST API
├── frontend/          # Next.js 14 App Router
├── docker-compose.yml # PostgreSQL
└── README.md
```

## Prerequisites

- Node.js 18+
- Docker (for PostgreSQL) or local PostgreSQL 16
- [Razorpay](https://dashboard.razorpay.com/) test keys (for payments)
- [Cloudinary](https://cloudinary.com/) keys (optional — local `/uploads` fallback)

## Quick start

### 1. Database

```bash
docker compose up -d
```

Schema and seed run automatically on first container start. To re-run manually:

```bash
chmod +x database/migrate.sh
./database/migrate.sh
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set JWT_SECRET, Razorpay keys, Cloudinary (optional)
npm install
npm run seed    # Sets correct passwords for demo users
npm run dev
```

API: http://localhost:5000  
Health: http://localhost:5000/api/health

### 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

App: http://localhost:3000

## Demo accounts

After `npm run seed` in backend:

| Role     | Email                 | Password      |
|----------|-----------------------|---------------|
| Admin    | admin@sastika.in      | Admin@123     |
| Customer | customer@sastika.in   | Customer@123  |

**Admin panel:** http://localhost:3000/admin/login (not linked in public nav)

## Payment modes

- `PAYMENT_MODE=razorpay` — Razorpay Checkout (default)
- `PAYMENT_MODE=cod` — Cash on delivery (marks paid immediately, no Razorpay)

## API routes

| Method | Route | Auth |
|--------|-------|------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/products | Public |
| GET/POST/PUT/DELETE | /api/products/:id | Admin for write |
| GET/POST/PUT/DELETE | /api/cart/* | Customer |
| POST/GET | /api/orders | Customer |
| PUT | /api/orders/status | Admin |
| POST | /api/payments/verify | Customer |
| GET | /api/admin/dashboard | Admin |
| GET | /api/admin/analytics | Admin |

## Deployment

### PostgreSQL

Use Neon, Supabase, or Railway. Set `DB_*` or `DATABASE_URL` in backend env.

### Backend (Railway / Render)

```bash
cd backend
# Set env vars from .env.example
# Build: uses Dockerfile
docker build -t sastika-api .
```

Expose port `5000`, set `CLIENT_URL` to your Vercel URL.

### Frontend (Vercel)

- Root directory: `frontend`
- Env: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### Docker Compose (local only)

```bash
docker compose up -d
```

## Features

**Customer:** Register, login, browse/search/filter products, cart, Razorpay checkout, order history, tracking timeline, profile.

**Admin:** Dashboard stats, product CRUD with image upload, order status management, user management, analytics charts.

## Security

- bcrypt password hashing (12 rounds)
- JWT Bearer authentication
- Role-based access (customer / admin)
- Joi input validation
- Parameterized SQL queries
- Helmet + CORS

## License

MIT

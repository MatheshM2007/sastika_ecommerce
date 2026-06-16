-- Seed data for Sastika E-commerce
-- Run `cd backend && npm run seed` to set passwords: Admin@123 / Customer@123

INSERT INTO users (name, email, password, role) VALUES
(
  'Sastika Admin',
  'admin@sastika.in',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
),
(
  'Demo Customer',
  'customer@sastika.in',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'customer'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (title, description, price, mrp, stock, category, image_url) VALUES
('Kanjivaram Silk Saree', 'Pure Kanjivaram silk with traditional zari border. Perfect for weddings and festivals.', 1299, 3499, 42, 'Sarees', 'https://images.unsplash.com/photo-1610030469983-98e55059c310?w=600'),
('Anarkali Kurti Set', 'Elegant floor-length Anarkali with dupatta and intricate embroidery.', 649, 1799, 88, 'Kurtis', 'https://images.unsplash.com/photo-1595777457583-95e059ce29ef?w=600'),
('Lehenga Choli', 'Bridal lehenga with heavy embroidery and net dupatta.', 2199, 5999, 15, 'Ethnic', 'https://images.unsplash.com/photo-1583391733981-5a974d0dc25c?w=600'),
('Cotton Palazzo Set', 'Comfortable cotton kurti-palazzo combo for daily wear.', 349, 899, 210, 'Kurtis', 'https://images.unsplash.com/photo-1572804013309-59a23b123e0f?w=600'),
('Banarasi Dupatta', 'Handwoven Banarasi dupatta with gold zari work.', 499, 1299, 8, 'Dupattas', 'https://images.unsplash.com/photo-1617627143750-d86bc21e3452?w=600'),
('Sharara Set', 'Stylish sharara with embroidered kurti for festive occasions.', 899, 2499, 34, 'Ethnic', 'https://images.unsplash.com/photo-1610030469983-98e55059c310?w=600'),
('Men Cotton Kurta', 'Breathable cotton kurta for casual and festive wear.', 399, 999, 120, 'Men', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600'),
('Kids Ethnic Set', 'Cute ethnic wear set for kids aged 4-10.', 299, 799, 65, 'Kids', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2e7?w=600'),
('Home Decor Cushion Set', 'Set of 5 printed cushion covers for living room.', 249, 699, 150, 'Home', 'https://images.unsplash.com/photo-1584100936595-c0654b8b4d4a?w=600'),
('Ayurvedic Face Pack', 'Natural herbal face pack for glowing skin.', 149, 399, 300, 'Beauty', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'),
('Designer Saree', 'Lightweight georgette saree with sequin work.', 799, 1999, 55, 'Sarees', 'https://images.unsplash.com/photo-1610030469983-98e55059c310?w=600'),
('Printed Kurti', 'Trendy printed kurti with 3/4 sleeves.', 279, 749, 180, 'Kurtis', 'https://images.unsplash.com/photo-1572804013309-59a23b123e0f?w=600'),
('Festive Dupatta', 'Embroidered festive dupatta in vibrant colors.', 199, 549, 95, 'Dupattas', 'https://images.unsplash.com/photo-1617627143750-d86bc21e3452?w=600'),
('Wall Hanging Set', 'Handcrafted wall hangings for home decor.', 349, 899, 40, 'Home', 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=600'),
('Lip Care Combo', 'Lip balm and scrub combo for daily care.', 99, 299, 500, 'Beauty', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600'),
('Party Wear Gown', 'Stunning party wear gown with stone work.', 1499, 3999, 22, 'Ethnic', 'https://images.unsplash.com/photo-1595777457583-95e059ce29ef?w=600'),
('Casual T-Shirt Pack', 'Pack of 3 cotton t-shirts for men.', 449, 1199, 200, 'Men', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600'),
('Kids Night Suit', 'Soft cotton night suit for kids.', 199, 499, 75, 'Kids', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2e7?w=600')
ON CONFLICT DO NOTHING;

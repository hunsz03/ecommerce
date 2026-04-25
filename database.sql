CREATE DATABASE IF NOT EXISTS ecommerce_app;
USE ecommerce_app;

CREATE TABLE IF NOT EXISTS products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE users;
TRUNCATE TABLE products;

INSERT INTO products (id, name, price, image, description, stock, category) VALUES
(1, 'Wireless Headphones', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', 'Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.', 45, 'Electronics'),
(2, 'Smart Watch', 349.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop', 'Fitness tracking smartwatch with heart rate monitor, GPS, and water resistance up to 50m.', 30, 'Electronics'),
(3, 'Laptop Backpack', 79.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', 'Durable laptop backpack with multiple compartments, USB charging port, and water-resistant material.', 78, 'Accessories'),
(4, 'Mechanical Keyboard', 149.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop', 'RGB mechanical gaming keyboard with customizable switches and macro keys.', 52, 'Electronics'),
(5, 'Coffee Maker', 129.99, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop', 'Programmable coffee maker with thermal carafe, auto-shutoff, and brew strength control.', 34, 'Home'),
(6, 'Running Shoes', 119.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop', 'Lightweight running shoes with responsive cushioning and breathable mesh upper.', 120, 'Sports'),
(7, 'Desk Lamp', 49.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop', 'LED desk lamp with adjustable brightness, color temperature control, and USB charging port.', 65, 'Home'),
(8, 'Bluetooth Speaker', 89.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop', 'Portable waterproof Bluetooth speaker with 360-degree sound and 12-hour battery life.', 88, 'Electronics');

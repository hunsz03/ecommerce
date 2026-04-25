<<<<<<< HEAD
# Ecommerce Project
My first GitHub project 🚀
=======
# ShopHub PHP Conversion

This project converts the provided React e-commerce frontend into a simple PHP and MySQL application with a lightweight MVC-like structure.

## Stack

- PHP 8+
- MySQL via phpMyAdmin
- Vanilla HTML/CSS with reusable partials
- PDO with prepared statements
- PHP sessions for cart state

## Structure

- `config/`: app and database configuration
- `controllers/`: cart and checkout business logic
- `models/`: database access for products and orders
- `partials/`: reusable layout components
- `assets/css/app.css`: shared storefront styling
- `database.sql`: database schema and starter products

## Setup

1. Create a database named `ecommerce_app` in phpMyAdmin, or just import `database.sql`.
2. Update database credentials in [config/config.php](/c:/xampp/htdocs/ecommerce/config/config.php:1) if needed.
3. Place the project under XAMPP `htdocs`, then visit `http://localhost/ecommerce/index.php`.

## Current Features

- Homepage with featured and latest products
- Product listing with search and category filtering
- Product detail page with live stock status
- Session-based cart with quantity updates and item removal
- Checkout page that stores orders and order items in MySQL
- Basic validation and stock-safe order creation

## Notes

- `users` is included in the schema for future auth work, but login/register is not implemented yet.
- The original React-only extras like wishlist, order history, and admin CRUD were not ported in this first pass so the core shopping flow stays stable and maintainable.
>>>>>>> 1868b0b (front end and backend user interface)

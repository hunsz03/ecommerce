<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$pageTitle = 'Home';
$featuredProducts = get_featured_products(4);
$latestProducts = get_latest_products(8);

require __DIR__ . '/partials/header.php';
?>

<section class="hero">
    <h1>Welcome to ShopHub</h1>
    <p>Discover amazing products at unbeatable prices with the same storefront feel as your React version, now powered by PHP sessions and MySQL data.</p>
    <div class="hero-actions">
        <a class="button" href="<?= e(base_url('products.php')) ?>">Shop Products</a>
        <a class="button-muted" href="<?= e(base_url('cart.php')) ?>">View Cart</a>
    </div>
</section>

<section class="section">
    <h2 class="section-title">Why Customers Love Us</h2>
    <div class="grid-3">
        <article class="feature-card">
            <h3>Free Shipping</h3>
            <p class="muted">Orders over $50 automatically unlock free shipping.</p>
        </article>
        <article class="feature-card">
            <h3>Secure Checkout</h3>
            <p class="muted">Prepared statements and server-side validation keep checkout simple and safe.</p>
        </article>
        <article class="feature-card">
            <h3>Fresh Inventory</h3>
            <p class="muted">Product stock levels are shown live from the database.</p>
        </article>
    </div>
</section>

<section class="section">
    <h2 class="section-title">Featured Products</h2>
    <p class="section-subtitle">A quick look at some standout items from the catalog.</p>
    <div class="grid-4">
        <?php foreach ($featuredProducts as $product): ?>
            <a class="product-card" href="<?= e(base_url('product-details.php?id=' . (int) $product['id'])) ?>">
                <img src="<?= e($product['image']) ?>" alt="<?= e($product['name']) ?>">
                <div class="product-card-body">
                    <div class="product-category"><?= e($product['category']) ?></div>
                    <h3 class="product-name"><?= e($product['name']) ?></h3>
                    <div class="product-price"><?= e(format_price((float) $product['price'])) ?></div>
                </div>
            </a>
        <?php endforeach; ?>
    </div>
</section>

<section class="section">
    <h2 class="section-title">Latest Products</h2>
    <div class="grid-4">
        <?php foreach ($latestProducts as $product): ?>
            <a class="product-card" href="<?= e(base_url('product-details.php?id=' . (int) $product['id'])) ?>">
                <img src="<?= e($product['image']) ?>" alt="<?= e($product['name']) ?>">
                <div class="product-card-body">
                    <div class="product-category"><?= e($product['category']) ?></div>
                    <h3 class="product-name"><?= e($product['name']) ?></h3>
                    <p class="muted"><?= e(mb_strimwidth($product['description'], 0, 80, '...')) ?></p>
                    <div class="product-price"><?= e(format_price((float) $product['price'])) ?></div>
                </div>
            </a>
        <?php endforeach; ?>
    </div>
</section>

<?php require __DIR__ . '/partials/footer.php'; ?>

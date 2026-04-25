<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$pageTitle = 'Products';
$search = trim($_GET['search'] ?? '');
$category = trim($_GET['category'] ?? '');
$categories = get_all_categories();
$products = search_products([
    'search' => $search,
    'category' => $category,
]);

require __DIR__ . '/partials/header.php';
?>

<section class="section">
    <h1 class="page-title">Our Products</h1>
    <p class="section-subtitle">Browse the catalog, search by keyword, or filter by category.</p>

    <form class="filters form-card" method="get" action="<?= e(base_url('products.php')) ?>">
        <div class="field">
            <label for="search">Search</label>
            <input id="search" type="text" name="search" value="<?= e($search) ?>" placeholder="Search by name or description">
        </div>
        <div class="field">
            <label for="category">Category</label>
            <select id="category" name="category">
                <option value="">All Categories</option>
                <?php foreach ($categories as $item): ?>
                    <option value="<?= e($item) ?>" <?= $category === $item ? 'selected' : '' ?>><?= e($item) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="field">
            <label>&nbsp;</label>
            <button type="submit">Apply Filters</button>
        </div>
    </form>

    <p class="muted">Showing <?= count($products) ?> product(s).</p>

    <div class="grid-4">
        <?php foreach ($products as $product): ?>
            <article class="product-card">
                <a href="<?= e(base_url('product-details.php?id=' . (int) $product['id'])) ?>">
                    <img src="<?= e($product['image']) ?>" alt="<?= e($product['name']) ?>">
                </a>
                <div class="product-card-body">
                    <div class="product-category"><?= e($product['category']) ?></div>
                    <h2 class="product-name"><?= e($product['name']) ?></h2>
                    <p class="muted"><?= e(mb_strimwidth($product['description'], 0, 90, '...')) ?></p>
                    <div class="product-meta">
                        <strong class="product-price"><?= e(format_price((float) $product['price'])) ?></strong>
                        <?php if ((int) $product['stock'] > 20): ?>
                            <span class="stock-ok">In stock</span>
                        <?php elseif ((int) $product['stock'] > 0): ?>
                            <span class="stock-low">Only <?= (int) $product['stock'] ?> left</span>
                        <?php else: ?>
                            <span class="stock-out">Out of stock</span>
                        <?php endif; ?>
                    </div>
                    <div class="hero-actions">
                        <a class="button" href="<?= e(base_url('product-details.php?id=' . (int) $product['id'])) ?>">View Details</a>
                    </div>
                </div>
            </article>
        <?php endforeach; ?>
    </div>

    <?php if ($products === []): ?>
        <div class="empty-state form-card">
            <h2>No products matched your filters.</h2>
            <p class="muted">Try a different search term or reset the category filter.</p>
        </div>
    <?php endif; ?>
</section>

<?php require __DIR__ . '/partials/footer.php'; ?>

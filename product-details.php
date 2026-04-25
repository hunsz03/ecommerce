<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$id = (int) ($_GET['id'] ?? 0);
$product = get_product_by_id($id);

if (!$product) {
    flash('error', 'Product not found.');
    redirect(base_url('products.php'));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        add_product_to_cart($id, (int) ($_POST['quantity'] ?? 1));
        flash('success', $product['name'] . ' was added to your cart.');
        redirect(base_url('cart.php'));
    } catch (Throwable $exception) {
        flash('error', $exception->getMessage());
        redirect(base_url('product-details.php?id=' . $id));
    }
}

$pageTitle = $product['name'];
$relatedProducts = get_related_products($product['category'], (int) $product['id'], 4);

require __DIR__ . '/partials/header.php';
?>

<section class="section">
    <a class="muted" href="<?= e(base_url('products.php')) ?>">&larr; Back to products</a>
    <div class="product-layout section">
        <div class="detail-image-wrap">
            <img class="detail-image" src="<?= e($product['image']) ?>" alt="<?= e($product['name']) ?>">
        </div>
        <div class="form-card">
            <div class="product-category"><?= e($product['category']) ?></div>
            <h1 class="page-title"><?= e($product['name']) ?></h1>
            <p class="product-price"><?= e(format_price((float) $product['price'])) ?></p>
            <div class="stock-line">
                <?php if ((int) $product['stock'] > 20): ?>
                    <span class="stock-ok">In stock (<?= (int) $product['stock'] ?> available)</span>
                <?php elseif ((int) $product['stock'] > 0): ?>
                    <span class="stock-low">Only <?= (int) $product['stock'] ?> left</span>
                <?php else: ?>
                    <span class="stock-out">Out of stock</span>
                <?php endif; ?>
            </div>
            <p class="product-description"><?= e($product['description']) ?></p>

            <form class="inline-form" method="post" action="<?= e(base_url('product-details.php?id=' . $id)) ?>">
                <div class="field">
                    <label for="quantity">Quantity</label>
                    <input
                        id="quantity"
                        class="qty-input"
                        type="number"
                        name="quantity"
                        min="1"
                        max="<?= (int) $product['stock'] ?>"
                        value="1"
                        <?= (int) $product['stock'] === 0 ? 'disabled' : '' ?>
                    >
                </div>
                <div class="field">
                    <label>&nbsp;</label>
                    <button type="submit" <?= (int) $product['stock'] === 0 ? 'disabled' : '' ?>>Add to Cart</button>
                </div>
            </form>
        </div>
    </div>
</section>

<?php if ($relatedProducts !== []): ?>
    <section class="section">
        <h2 class="section-title">Related Products</h2>
        <div class="grid-4">
            <?php foreach ($relatedProducts as $related): ?>
                <a class="product-card" href="<?= e(base_url('product-details.php?id=' . (int) $related['id'])) ?>">
                    <img src="<?= e($related['image']) ?>" alt="<?= e($related['name']) ?>">
                    <div class="product-card-body">
                        <div class="product-category"><?= e($related['category']) ?></div>
                        <h3 class="product-name"><?= e($related['name']) ?></h3>
                        <div class="product-price"><?= e(format_price((float) $related['price'])) ?></div>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
    </section>
<?php endif; ?>

<?php require __DIR__ . '/partials/footer.php'; ?>

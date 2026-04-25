<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $productId = (int) ($_POST['product_id'] ?? 0);

    if ($action === 'update') {
        update_cart_item($productId, (int) ($_POST['quantity'] ?? 1));
        flash('success', 'Cart updated successfully.');
    } elseif ($action === 'remove') {
        remove_cart_item($productId);
        flash('success', 'Item removed from cart.');
    }

    redirect(base_url('cart.php'));
}

$pageTitle = 'Cart';
$cartItems = get_detailed_cart_items();
$subtotal = cart_subtotal();
$shipping = $subtotal > 50 ? 0.0 : ($subtotal > 0 ? 9.99 : 0.0);
$grandTotal = $subtotal + $shipping;

require __DIR__ . '/partials/header.php';
?>

<section class="section">
    <h1 class="page-title">Shopping Cart</h1>

    <?php if ($cartItems === []): ?>
        <div class="empty-state form-card">
            <h2>Your cart is empty.</h2>
            <p class="muted">Add a few products to continue to checkout.</p>
            <a class="button" href="<?= e(base_url('products.php')) ?>">Browse Products</a>
        </div>
    <?php else: ?>
        <div class="checkout-grid">
            <div class="cart-items">
                <?php foreach ($cartItems as $item): ?>
                    <article class="cart-row">
                        <a class="cart-thumb" href="<?= e(base_url('product-details.php?id=' . $item['id'])) ?>">
                            <img src="<?= e($item['image']) ?>" alt="<?= e($item['name']) ?>">
                        </a>
                        <div>
                            <h2 class="product-name"><?= e($item['name']) ?></h2>
                            <p class="muted"><?= e($item['category']) ?></p>
                            <p class="product-price"><?= e(format_price($item['price'])) ?></p>
                        </div>
                        <form class="qty-form" method="post" action="<?= e(base_url('cart.php')) ?>">
                            <input type="hidden" name="action" value="update">
                            <input type="hidden" name="product_id" value="<?= $item['id'] ?>">
                            <input class="qty-input" type="number" name="quantity" min="1" max="<?= $item['stock'] ?>" value="<?= $item['quantity'] ?>">
                            <button type="submit">Update</button>
                        </form>
                        <form class="inline-form" method="post" action="<?= e(base_url('cart.php')) ?>">
                            <input type="hidden" name="action" value="remove">
                            <input type="hidden" name="product_id" value="<?= $item['id'] ?>">
                            <button type="submit">Remove</button>
                        </form>
                    </article>
                <?php endforeach; ?>
            </div>

            <aside class="summary-card">
                <h2>Order Summary</h2>
                <div class="summary-line">
                    <span class="muted">Subtotal</span>
                    <strong><?= e(format_price($subtotal)) ?></strong>
                </div>
                <div class="summary-line">
                    <span class="muted">Shipping</span>
                    <strong><?= $shipping === 0.0 ? 'Free' : e(format_price($shipping)) ?></strong>
                </div>
                <div class="summary-total">
                    <span>Total</span>
                    <span><?= e(format_price($grandTotal)) ?></span>
                </div>
                <p class="muted">Shipping becomes free for orders above $50.</p>
                <a class="button" href="<?= e(base_url('checkout.php')) ?>">Proceed to Checkout</a>
            </aside>
        </div>
    <?php endif; ?>
</section>

<?php require __DIR__ . '/partials/footer.php'; ?>

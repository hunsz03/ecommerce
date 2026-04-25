<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';

$pageTitle = 'Checkout';
$cartItems = get_detailed_cart_items();
$subtotal = cart_subtotal();
$shipping = $subtotal > 50 ? 0.0 : ($subtotal > 0 ? 9.99 : 0.0);
$total = $subtotal + $shipping;
$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = [
        'customer_name' => trim($_POST['customer_name'] ?? ''),
        'address' => trim($_POST['address'] ?? ''),
        'payment_method' => trim($_POST['payment_method'] ?? ''),
    ];

    set_old($input);
    $errors = validate_checkout($input, $cartItems);

    if ($errors === []) {
        try {
            $orderId = create_order($input, $cartItems, $total);
            $_SESSION['cart'] = [];
            clear_old();
            flash('success', 'Order #' . $orderId . ' placed successfully.');
            redirect(base_url('index.php'));
        } catch (Throwable $exception) {
            $errors['checkout'] = $exception->getMessage();
        }
    }
}

require __DIR__ . '/partials/header.php';
?>

<section class="section">
    <h1 class="page-title">Checkout</h1>

    <?php if (isset($errors['checkout'])): ?>
        <div class="alert alert-error"><?= e($errors['checkout']) ?></div>
    <?php endif; ?>

    <?php if ($cartItems === []): ?>
        <div class="empty-state form-card">
            <h2>Your cart is empty.</h2>
            <p class="muted">You need at least one product before checking out.</p>
            <a class="button" href="<?= e(base_url('products.php')) ?>">Browse Products</a>
        </div>
    <?php else: ?>
        <form method="post" action="<?= e(base_url('checkout.php')) ?>">
            <div class="checkout-grid">
                <div class="checkout-main">
                    <section class="form-card">
                        <h2>Customer Information</h2>
                        <div class="form-grid">
                            <div class="field full">
                                <label for="customer_name">Full Name</label>
                                <input id="customer_name" type="text" name="customer_name" value="<?= e(old('customer_name')) ?>">
                                <?php if (isset($errors['customer_name'])): ?>
                                    <div class="error-text"><?= e($errors['customer_name']) ?></div>
                                <?php endif; ?>
                            </div>
                            <div class="field full">
                                <label for="address">Address</label>
                                <textarea id="address" name="address" rows="5"><?= e(old('address')) ?></textarea>
                                <?php if (isset($errors['address'])): ?>
                                    <div class="error-text"><?= e($errors['address']) ?></div>
                                <?php endif; ?>
                            </div>
                            <div class="field full">
                                <label for="payment_method">Payment Method</label>
                                <select id="payment_method" name="payment_method">
                                    <option value="">Select a payment method</option>
                                    <?php foreach (['Cash on Delivery', 'Bank Transfer', 'Card on Delivery'] as $method): ?>
                                        <option value="<?= e($method) ?>" <?= old('payment_method') === $method ? 'selected' : '' ?>><?= e($method) ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <?php if (isset($errors['payment_method'])): ?>
                                    <div class="error-text"><?= e($errors['payment_method']) ?></div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </section>
                </div>

                <aside class="summary-card">
                    <h2>Order Summary</h2>
                    <?php foreach ($cartItems as $item): ?>
                        <div class="summary-line">
                            <span class="muted"><?= e($item['name']) ?> x <?= $item['quantity'] ?></span>
                            <strong><?= e(format_price($item['line_total'])) ?></strong>
                        </div>
                    <?php endforeach; ?>
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
                        <span><?= e(format_price($total)) ?></span>
                    </div>
                    <?php if (isset($errors['stock'])): ?>
                        <div class="error-text"><?= e($errors['stock']) ?></div>
                    <?php endif; ?>
                    <?php if (isset($errors['cart'])): ?>
                        <div class="error-text"><?= e($errors['cart']) ?></div>
                    <?php endif; ?>
                    <button type="submit">Place Order</button>
                </aside>
            </div>
        </form>
    <?php endif; ?>
</section>

<?php require __DIR__ . '/partials/footer.php'; ?>

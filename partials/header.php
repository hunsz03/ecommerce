<?php
$pageTitle = $pageTitle ?? APP_NAME;
$cartCount = cart_item_count();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($pageTitle) ?> | <?= e(APP_NAME) ?></title>
    <link rel="stylesheet" href="<?= e(base_url('assets/css/app.css')) ?>">
</head>
<body>
    <header class="site-header">
        <div class="container nav-shell">
            <a class="brand" href="<?= e(base_url('index.php')) ?>">ShopHub</a>
            <nav class="nav">
                <a class="<?= e(selected_nav('index.php')) ?>" href="<?= e(base_url('index.php')) ?>">Home</a>
                <a class="<?= e(selected_nav('products.php')) ?>" href="<?= e(base_url('products.php')) ?>">Products</a>
                <a class="<?= e(selected_nav('cart.php')) ?>" href="<?= e(base_url('cart.php')) ?>">Cart <span class="badge"><?= $cartCount ?></span></a>
                <a class="<?= e(selected_nav('checkout.php')) ?>" href="<?= e(base_url('checkout.php')) ?>">Checkout</a>
            </nav>
        </div>
    </header>
    <main class="page-main">
        <div class="container">
            <?php if ($success = flash('success')): ?>
                <div class="alert alert-success"><?= e($success) ?></div>
            <?php endif; ?>
            <?php if ($error = flash('error')): ?>
                <div class="alert alert-error"><?= e($error) ?></div>
            <?php endif; ?>

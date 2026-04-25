<?php

declare(strict_types=1);

function get_detailed_cart_items(): array
{
    $cart = current_cart();
    $products = get_products_for_cart(array_map('intval', array_keys($cart)));
    $items = [];

    foreach ($cart as $productId => $row) {
        $productId = (int) $productId;
        if (!isset($products[$productId])) {
            continue;
        }

        $product = $products[$productId];
        $quantity = max(1, (int) $row['quantity']);
        $lineTotal = $quantity * (float) $product['price'];

        $items[] = [
            'id' => $productId,
            'name' => $product['name'],
            'price' => (float) $product['price'],
            'image' => $product['image'],
            'category' => $product['category'],
            'stock' => (int) $product['stock'],
            'quantity' => $quantity,
            'line_total' => $lineTotal,
        ];
    }

    return $items;
}

function cart_subtotal(): float
{
    $total = 0.0;

    foreach (get_detailed_cart_items() as $item) {
        $total += $item['line_total'];
    }

    return $total;
}

function add_product_to_cart(int $productId, int $quantity = 1): void
{
    $product = get_product_by_id($productId);

    if (!$product) {
        throw new RuntimeException('Product not found.');
    }

    if ((int) $product['stock'] < 1) {
        throw new RuntimeException('This product is out of stock.');
    }

    $cart = current_cart();
    $existing = (int) ($cart[$productId]['quantity'] ?? 0);
    $newQuantity = min($existing + max(1, $quantity), (int) $product['stock']);
    $cart[$productId] = ['quantity' => $newQuantity];
    $_SESSION['cart'] = $cart;
}

function update_cart_item(int $productId, int $quantity): void
{
    $cart = current_cart();

    if (!isset($cart[$productId])) {
        return;
    }

    if ($quantity <= 0) {
        unset($cart[$productId]);
        $_SESSION['cart'] = $cart;
        return;
    }

    $product = get_product_by_id($productId);
    if (!$product) {
        unset($cart[$productId]);
        $_SESSION['cart'] = $cart;
        return;
    }

    $cart[$productId]['quantity'] = min($quantity, (int) $product['stock']);
    $_SESSION['cart'] = $cart;
}

function remove_cart_item(int $productId): void
{
    $cart = current_cart();
    unset($cart[$productId]);
    $_SESSION['cart'] = $cart;
}

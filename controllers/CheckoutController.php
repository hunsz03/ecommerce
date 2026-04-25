<?php

declare(strict_types=1);

function validate_checkout(array $input, array $cartItems): array
{
    $errors = [];

    if ($cartItems === []) {
        $errors['cart'] = 'Your cart is empty.';
    }

    if (trim($input['customer_name'] ?? '') === '') {
        $errors['customer_name'] = 'Customer name is required.';
    }

    if (trim($input['address'] ?? '') === '') {
        $errors['address'] = 'Address is required.';
    }

    $allowedPaymentMethods = ['Cash on Delivery', 'Bank Transfer', 'Card on Delivery'];
    if (!in_array($input['payment_method'] ?? '', $allowedPaymentMethods, true)) {
        $errors['payment_method'] = 'Please select a valid payment method.';
    }

    foreach ($cartItems as $item) {
        if ($item['quantity'] > $item['stock']) {
            $errors['stock'] = 'Some cart items are no longer available in the requested quantity.';
            break;
        }
    }

    return $errors;
}

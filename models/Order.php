<?php

declare(strict_types=1);

function create_order(array $customerData, array $cartItems, float $totalPrice): int
{
    $pdo = db();
    $pdo->beginTransaction();

    try {
        $orderStmt = $pdo->prepare(
            'INSERT INTO orders (customer_name, address, payment_method, total_price, created_at)
             VALUES (:customer_name, :address, :payment_method, :total_price, NOW())'
        );

        $orderStmt->execute([
            ':customer_name' => $customerData['customer_name'],
            ':address' => $customerData['address'],
            ':payment_method' => $customerData['payment_method'],
            ':total_price' => $totalPrice,
        ]);

        $orderId = (int) $pdo->lastInsertId();

        $itemStmt = $pdo->prepare(
            'INSERT INTO order_items (order_id, product_id, quantity, price)
             VALUES (:order_id, :product_id, :quantity, :price)'
        );

        $stockStmt = $pdo->prepare(
            'UPDATE products SET stock = stock - :quantity WHERE id = :product_id AND stock >= :quantity'
        );

        foreach ($cartItems as $item) {
            $itemStmt->execute([
                ':order_id' => $orderId,
                ':product_id' => $item['id'],
                ':quantity' => $item['quantity'],
                ':price' => $item['price'],
            ]);

            $stockStmt->execute([
                ':product_id' => $item['id'],
                ':quantity' => $item['quantity'],
            ]);

            if ($stockStmt->rowCount() === 0) {
                throw new RuntimeException('One of the items is no longer available in the requested quantity.');
            }
        }

        $pdo->commit();

        return $orderId;
    } catch (Throwable $exception) {
        $pdo->rollBack();
        throw $exception;
    }
}

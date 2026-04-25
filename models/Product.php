<?php

declare(strict_types=1);

function get_featured_products(int $limit = 4): array
{
    $stmt = db()->prepare('SELECT * FROM products ORDER BY id DESC LIMIT :limit');
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll();
}

function get_latest_products(int $limit = 8): array
{
    $stmt = db()->prepare('SELECT * FROM products ORDER BY id DESC LIMIT :limit');
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll();
}

function get_all_categories(): array
{
    $stmt = db()->query('SELECT DISTINCT category FROM products ORDER BY category ASC');
    return $stmt->fetchAll(PDO::FETCH_COLUMN);
}

function search_products(array $filters = []): array
{
    $sql = 'SELECT * FROM products WHERE 1=1';
    $params = [];

    if (!empty($filters['search'])) {
        $sql .= ' AND (name LIKE :search OR description LIKE :search)';
        $params[':search'] = '%' . $filters['search'] . '%';
    }

    if (!empty($filters['category'])) {
        $sql .= ' AND category = :category';
        $params[':category'] = $filters['category'];
    }

    $sql .= ' ORDER BY id DESC';

    $stmt = db()->prepare($sql);
    $stmt->execute($params);

    return $stmt->fetchAll();
}

function get_product_by_id(int $id): ?array
{
    $stmt = db()->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $product = $stmt->fetch();

    return $product ?: null;
}

function get_related_products(string $category, int $excludeId, int $limit = 4): array
{
    $stmt = db()->prepare(
        'SELECT * FROM products WHERE category = :category AND id != :id ORDER BY id DESC LIMIT :limit'
    );
    $stmt->bindValue(':category', $category);
    $stmt->bindValue(':id', $excludeId, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll();
}

function get_products_for_cart(array $productIds): array
{
    if ($productIds === []) {
        return [];
    }

    $placeholders = implode(',', array_fill(0, count($productIds), '?'));
    $stmt = db()->prepare("SELECT * FROM products WHERE id IN ($placeholders)");
    $stmt->execute(array_values($productIds));

    $products = [];
    foreach ($stmt->fetchAll() as $product) {
        $products[(int) $product['id']] = $product;
    }

    return $products;
}

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/auth_middleware.php';

// Verify Firebase Auth token and role admin
$authUser = requireAuth($pdo, ['admin']);

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$required = ['product_key', 'name_en', 'category', 'price'];
foreach ($required as $field) {
    if (empty($data[$field]) && $data[$field] !== '0') {
        echo json_encode(["success" => false, "message" => "Missing required field: $field"]);
        exit;
    }
}

// Default to empty strings if not provided
$data['name_hi'] = $data['name_hi'] ?? '';
$data['desc_en'] = $data['desc_en'] ?? '';
$data['desc_hi'] = $data['desc_hi'] ?? '';
$data['image_url'] = $data['image_url'] ?? '';
$variants = isset($data['variants']) ? (is_string($data['variants']) ? $data['variants'] : json_encode($data['variants'])) : '[]';

$productKey = htmlspecialchars(strip_tags($data['product_key']));
$nameEn = htmlspecialchars(strip_tags($data['name_en']));
$nameHi = htmlspecialchars(strip_tags($data['name_hi']));
$category = htmlspecialchars(strip_tags($data['category']));
$price = htmlspecialchars(strip_tags($data['price']));
$stock = isset($data['stock']) ? intval($data['stock']) : 0;
$descEn = htmlspecialchars(strip_tags($data['desc_en']));
$descHi = htmlspecialchars(strip_tags($data['desc_hi']));
$imageUrl = htmlspecialchars(strip_tags($data['image_url']));

try {
    if (!empty($data['id'])) {
        // Update product
        $stmt = $pdo->prepare("
            UPDATE products 
            SET product_key = ?, name_en = ?, name_hi = ?, category = ?, price = ?, stock = ?, desc_en = ?, desc_hi = ?, image_url = ?, variants = ? 
            WHERE id = ?
        ");
        $stmt->execute([$productKey, $nameEn, $nameHi, $category, $price, $stock, $descEn, $descHi, $imageUrl, $variants, intval($data['id'])]);
        echo json_encode(["success" => true, "message" => "Product updated successfully."]);
    } else {
        // Insert product
        $stmt = $pdo->prepare("
            INSERT INTO products (product_key, name_en, name_hi, category, price, stock, desc_en, desc_hi, image_url, variants) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$productKey, $nameEn, $nameHi, $category, $price, $stock, $descEn, $descHi, $imageUrl, $variants]);
        echo json_encode(["success" => true, "message" => "Product added successfully."]);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>

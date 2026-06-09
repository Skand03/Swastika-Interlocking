<?php
// submit_order.php - Secured with PDO Prepared Statements
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include secure database connection
require_once __DIR__ . '/db_connect.php';

// For multipart/form-data requests, use $_POST and $_FILES
$data = $_POST;

if (empty($data)) {
    $json = file_get_contents('php://input');
    if (!empty($json)) {
        $data = json_decode($json, true);
    }
}

if (empty($data)) {
    echo json_encode(["success" => false, "message" => "Invalid form data received."]);
    exit;
}

$requiredFields = ['customer_name', 'phone', 'city', 'product_type', 'quantity', 'address'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        echo json_encode(["success" => false, "message" => "Missing required field: $field"]);
        exit;
    }
}

// Handle optional image upload
$imagePath = null;
if (isset($_FILES['site_photo']) && $_FILES['site_photo']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/../public/uploads/orders/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $ext = pathinfo($_FILES['site_photo']['name'], PATHINFO_EXTENSION);
    $uniqueName = uniqid('order_', true) . '.' . $ext;
    $destPath = $uploadDir . $uniqueName;
    if (move_uploaded_file($_FILES['site_photo']['tmp_name'], $destPath)) {
        // Store relative path for later retrieval
        $imagePath = 'uploads/orders/' . $uniqueName;
    }
}

// Generate unique order ID
$orderId = "ORD-" . date('ymd') . "-" . rand(1000, 9999);

try {
    // PREPARED STATEMENT to prevent SQL injection
    $stmt = $pdo->prepare("INSERT INTO orders (order_id, customer_name, phone, city, product_type, quantity, address, special_req, status, image_path) VALUES (:order_id, :name, :phone, :city, :product, :qty, :address, :req, 'Pending', :img)");

    // If product_type is an array (JSON), keep it as a JSON string.
    $full_product_type = '';
    if (is_array($data['product_type'])) {
        $full_product_type = json_encode($data['product_type']);
    } else {
        $full_product_type = isset($data['sub_type']) && !empty($data['sub_type'])
            ? htmlspecialchars(strip_tags($data['product_type'])) . ' - ' . htmlspecialchars(strip_tags($data['sub_type']))
            : htmlspecialchars(strip_tags($data['product_type']));
    }

    $stmt->execute([
        ':order_id' => $orderId,
        ':name'     => htmlspecialchars(strip_tags($data['customer_name'])),
        ':phone'    => htmlspecialchars(strip_tags($data['phone'])),
        ':city'     => htmlspecialchars(strip_tags($data['city'])),
        ':product'  => $full_product_type,
        ':qty'      => htmlspecialchars(strip_tags($data['quantity'])),
        ':address'  => htmlspecialchars(strip_tags($data['address'])),
        ':req'      => isset($data['special_req']) ? htmlspecialchars(strip_tags($data['special_req'])) : '',
        ':img'      => $imagePath
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Order submitted successfully.",
        "order_id" => $orderId
    ]);
} catch (\PDOException $e) {
    // Log error internally, do not expose details to user
    error_log("DB Error in submit_order: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Failed to save order to database."]);
}
?>

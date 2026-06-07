<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Ensure database setup has run
$dbFile = __DIR__ . '/database.db';
if (!file_exists($dbFile)) {
    include_once __DIR__ . '/setup.php';
}

// Check for POST request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed. Use POST request."
    ]);
    exit;
}

// Retrieve JSON input payload
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!$input) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON payload."
    ]);
    exit;
}

// Destructure inputs
$name = isset($input['customer_name']) ? trim($input['customer_name']) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$city = isset($input['city']) ? trim($input['city']) : '';
$productType = isset($input['product_type']) ? trim($input['product_type']) : '';
$quantity = isset($input['quantity']) ? intval($input['quantity']) : 0;
$address = isset($input['address']) ? trim($input['address']) : '';
$specialReq = isset($input['special_req']) ? trim($input['special_req']) : '';

// Validation checks
if (empty($name) || empty($phone) || empty($productType) || empty($address)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Required fields are missing: customer_name, phone, product_type, address."
    ]);
    exit;
}

try {
    $db = new PDO("sqlite:" . $dbFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // If it's a quick quote request from the homepage, we insert it into messages, otherwise into orders
    if ($productType === 'Quote') {
        $stmt = $db->prepare("INSERT INTO messages (name, phone, requirements) VALUES (:name, :phone, :req)");
        $stmt->execute([
            ':name' => $name,
            ':phone' => $phone,
            ':req' => $specialReq
        ]);
        
        $orderId = $db->lastInsertId();
        
        echo json_encode([
            "success" => true,
            "message" => "Custom quote request saved successfully.",
            "order_id" => "QUOTE-" . $orderId
        ]);
    } else {
        $stmt = $db->prepare("INSERT INTO orders (customer_name, phone, city, product_type, quantity, address, special_req) 
                              VALUES (:name, :phone, :city, :product, :qty, :address, :req)");
        $stmt->execute([
            ':name' => $name,
            ':phone' => $phone,
            ':city' => $city,
            ':product' => $productType,
            ':qty' => $quantity,
            ':address' => $address,
            ':req' => $specialReq
        ]);
        
        $orderId = $db->lastInsertId();
        
        echo json_encode([
            "success" => true,
            "message" => "Order booking submitted successfully.",
            "order_id" => "SWA-" . str_pad($orderId, 5, '0', STR_PAD_LEFT)
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database insertion failed: " . $e->getMessage()
    ]);
}
?>

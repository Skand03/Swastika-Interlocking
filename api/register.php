<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['full_name']) || !isset($data['phone']) || !isset($data['city']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Required fields missing."]);
    exit();
}

try {
    $dbFile = __DIR__ . '/database.db';
    $db = new PDO("sqlite:" . $dbFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if phone number is already registered
    $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE phone = ?");
    $stmt->execute([$data['phone']]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(["success" => false, "message" => "Phone number already registered."]);
        exit();
    }

    // Insert user
    $stmt = $db->prepare("INSERT INTO users (full_name, phone, city, password, role) VALUES (?, ?, ?, ?, 'customer')");
    $stmt->execute([
        $data['full_name'],
        $data['phone'],
        $data['city'],
        $data['password']
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Registration successful! You can now log in."
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>

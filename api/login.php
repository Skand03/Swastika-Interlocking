<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['phone']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Phone number and password are required."]);
    exit();
}

try {
    $dbFile = __DIR__ . '/database.db';
    $db = new PDO("sqlite:" . $dbFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->prepare("SELECT id, full_name, phone, city, role, password FROM users WHERE phone = ?");
    $stmt->execute([$data['phone']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && $user['password'] === $data['password']) {
        unset($user['password']); // Don't return password
        echo json_encode([
            "success" => true,
            "message" => "Login successful.",
            "user" => $user
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Invalid phone number or password."
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>

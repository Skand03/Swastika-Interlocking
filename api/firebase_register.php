<?php
// firebase_register.php - Register a new user authenticated via Firebase
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['full_name']) || !isset($data['phone']) || !isset($data['firebase_uid'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Required fields: full_name, phone, firebase_uid."]);
    exit();
}

$full_name = htmlspecialchars(strip_tags(trim($data['full_name'])));
$phone = htmlspecialchars(strip_tags(trim($data['phone'])));
$city = isset($data['city']) ? htmlspecialchars(strip_tags(trim($data['city']))) : '';
$address = isset($data['address']) ? htmlspecialchars(strip_tags(trim($data['address']))) : '';
$pincode = isset($data['pincode']) ? htmlspecialchars(strip_tags(trim($data['pincode']))) : '';
$firebase_uid = trim($data['firebase_uid']);
$email = isset($data['email']) ? htmlspecialchars(strip_tags(trim($data['email']))) : '';

// Validate phone
if (strlen($phone) !== 10 || !ctype_digit($phone)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Phone number must be exactly 10 digits."]);
    exit();
}

try {
    // Check if phone number or email is already registered
    $stmt = $pdo->prepare("SELECT id, firebase_uid, email, phone FROM users WHERE phone = ? OR (email = ? AND email IS NOT NULL AND email != '') LIMIT 1");
    $stmt->execute([$phone, $email]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        // If the existing user has a DIFFERENT, non-empty firebase_uid, this is a recreated account scenario.
        if (!empty($existing['firebase_uid']) && $existing['firebase_uid'] !== $firebase_uid) {
            http_response_code(403);
            echo json_encode([
                "success" => false,
                "code" => "RECOVERY_REQUIRED",
                "message" => "This phone number or email is already associated with another account. Manual admin approval is required for account recovery."
            ]);
            exit();
        }

        // If firebase_uid is empty (e.g. seeded database row), we can link it
        if (empty($existing['firebase_uid'])) {
            $updateStmt = $pdo->prepare("UPDATE users SET firebase_uid = ?, email = ?, provider = ? WHERE id = ?");
            $updateStmt->execute([$firebase_uid, $email ?: $existing['email'], !empty($data['is_google']) ? 'google.com' : 'email', $existing['id']]);
        }
        
        // Return the user record
        $stmt = $pdo->prepare("SELECT id, full_name, phone, city, address, pincode, role, email, firebase_uid, status, provider FROM users WHERE id = ?");
        $stmt->execute([$existing['id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "message" => "Account linked successfully.",
            "user" => $user
        ]);
        exit();
    }

    // Check if firebase_uid is already registered (e.g., Google user re-registering)
    $stmt = $pdo->prepare("SELECT id FROM users WHERE firebase_uid = ?");
    $stmt->execute([$firebase_uid]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "This account is already registered."]);
        exit();
    }

    // Determine role - admin for specific phone numbers
    $adminPhones = ['9236499663'];
    $role = in_array($phone, $adminPhones) ? 'admin' : 'customer';
    $provider = !empty($data['is_google']) ? 'google.com' : 'password';

    // Insert new user with status='active'
    $stmt = $pdo->prepare(
        "INSERT INTO users (full_name, phone, city, address, pincode, password, role, firebase_uid, email, status, provider)
         VALUES (?, ?, ?, ?, ?, '', ?, ?, ?, 'active', ?)"
    );
    $stmt->execute([$full_name, $phone, $city, $address, $pincode, $role, $firebase_uid, $email, $provider]);

    $newId = $pdo->lastInsertId();

    $user = [
        "id" => $newId,
        "full_name" => $full_name,
        "phone" => $phone,
        "city" => $city,
        "address" => $address,
        "pincode" => $pincode,
        "role" => $role,
        "email" => $email,
        "firebase_uid" => $firebase_uid
    ];

    echo json_encode([
        "success" => true,
        "message" => "Registration successful!",
        "user" => $user
    ]);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>

<?php
// chat.php - Secured with PDO Prepared Statements
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

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || empty($data['message'])) {
    echo json_encode(["success" => false, "response" => "Please send a valid message."]);
    exit;
}

$userMsg = strtolower(trim($data['message']));
$userIp = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';

$name = !empty($data['name']) ? htmlspecialchars(strip_tags($data['name'])) : 'Chatbot Guest';
$phone = !empty($data['phone']) ? htmlspecialchars(strip_tags($data['phone'])) : 'N/A';
$originalMsg = htmlspecialchars(strip_tags($data['message']));

// Log the chat lead securely into Inquiries (as requested: "attach with inqueries dashbord")
try {
    $stmt = $pdo->prepare("INSERT INTO messages (name, phone, requirements) VALUES (:name, :phone, :msg)");
    $stmt->execute([
        ':name' => $name,
        ':phone' => $phone,
        ':msg' => "[Chatbot Query] " . $originalMsg
    ]);
} catch (\PDOException $e) {
    error_log("DB Error in chat.php: " . $e->getMessage());
}

// Dynamic Bot Logic
$botResponse = "Thank you for reaching out! A representative will connect with you shortly.";
$matched = false;

// 1. Static checks for greetings and common queries
if (strpos($userMsg, 'hi') !== false || strpos($userMsg, 'hello') !== false || strpos($userMsg, 'hey') !== false || strpos($userMsg, 'नमस्ते') !== false) {
    $botResponse = "Hello! Welcome to Swastika Interlocking. How can we help you today with your construction needs?";
    $matched = true;
} else if (strpos($userMsg, 'contact') !== false || strpos($userMsg, 'call') !== false || strpos($userMsg, 'number') !== false) {
    $botResponse = "You can contact us at +91 8400936290 or visit our office in Jaipur.";
    $matched = true;
} else if (strpos($userMsg, 'order') !== false || strpos($userMsg, 'book') !== false || strpos($userMsg, 'buy') !== false) {
    $botResponse = "You can easily book an order by clicking the 'Book Order' button in the navigation menu!";
    $matched = true;
}

// 2. Dynamic DB search for products and projects
if (!$matched) {
    $words = explode(' ', $userMsg);
    $searchKeywords = [];
    foreach ($words as $w) {
        $w = preg_replace('/[^a-z0-9]/i', '', $w);
        if (strlen($w) > 3) {
            $searchKeywords[] = $w;
        }
    }

    if (!empty($searchKeywords)) {
        try {
            $productFound = false;
            foreach ($searchKeywords as $keyword) {
                // Search Products
                $stmt = $pdo->prepare("SELECT * FROM products WHERE name_en LIKE :kw OR name_hi LIKE :kw LIMIT 1");
                $stmt->execute([':kw' => "%$keyword%"]);
                $prod = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($prod) {
                    $priceStr = empty($prod['price']) ? "Please contact us for accurate pricing." : "It starts at ₹" . $prod['price'] . ".";
                    $stockStr = empty($prod['stock']) ? "It is currently available." : "We have " . $prod['stock'] . " in stock.";
                    $botResponse = "Yes! We offer " . $prod['name_en'] . ". " . $priceStr . " " . $stockStr;
                    $productFound = true;
                    $matched = true;
                    break;
                }
            }
            
            if (!$productFound) {
                foreach ($searchKeywords as $keyword) {
                    // Search RCC Projects (Wrap in try-catch in case table doesn't exist in local SQLite)
                    try {
                        $stmt = $pdo->prepare("SELECT * FROM rcc_projects WHERE name_en LIKE :kw OR name_hi LIKE :kw LIMIT 1");
                        $stmt->execute([':kw' => "%$keyword%"]);
                        $rcc = $stmt->fetch(PDO::FETCH_ASSOC);
                        
                        if ($rcc) {
                            $botResponse = "Yes, we handle " . $rcc['name_en'] . " projects! " . ($rcc['desc_en'] ?: "Please contact us for more details.");
                            $matched = true;
                            break;
                        }
                    } catch (\PDOException $e) {
                        // Ignore missing rcc_projects table
                    }
                }
            }
        } catch (\PDOException $e) {
            error_log("DB Search Error in chat.php: " . $e->getMessage());
        }
    }
}

// Simulate typing delay
usleep(500000); // 0.5 seconds

echo json_encode([
    "success" => true,
    "response" => $botResponse
]);
?>

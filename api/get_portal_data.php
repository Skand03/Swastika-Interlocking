<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Firebase-Token');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include secure database connection
require_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/auth_middleware.php';

// Verify ID token
$authUser = requireAuth($pdo);

if (!isset($_GET['phone']) || !isset($_GET['role'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing phone or role parameter."]);
    exit();
}

$phone = $_GET['phone'];
$role = $_GET['role'];

// Restrict access: customers can only view their own data
if ($authUser['role'] !== 'admin') {
    if ($role !== 'customer' || $authUser['phone'] !== $phone) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Access denied. You can only access your own data."]);
        exit();
    }
}

try {
    // Verify user exists and check role
    $stmt = $pdo->prepare("SELECT id, full_name, phone, city, address, pincode, role, email, firebase_uid FROM users WHERE phone = ?");
    $stmt->execute([$phone]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["success" => false, "message" => "User not found."]);
        exit();
    }

    if ($role === 'admin' && $user['role'] !== 'admin') {
        echo json_encode(["success" => false, "message" => "Unauthorized access."]);
        exit();
    }

    if ($role === 'admin') {
        // Fetch all orders
        $stmtOrders = $pdo->prepare("SELECT * FROM orders ORDER BY created_at DESC");
        $stmtOrders->execute();
        $orders = $stmtOrders->fetchAll(PDO::FETCH_ASSOC);

        // Fetch all contact messages/inquiries
        $stmtMsg = $pdo->prepare("SELECT * FROM messages ORDER BY created_at DESC");
        $stmtMsg->execute();
        $messages = $stmtMsg->fetchAll(PDO::FETCH_ASSOC);

        // Fetch chatbot leads
        $stmtChat = $pdo->prepare("SELECT * FROM chat_leads ORDER BY created_at DESC");
        $stmtChat->execute();
        $chatLeads = $stmtChat->fetchAll(PDO::FETCH_ASSOC);

        // Fetch all customers/users
        $stmtUsers = $pdo->prepare("SELECT id, full_name, phone, city, role, created_at FROM users WHERE role = 'customer' ORDER BY created_at DESC");
        $stmtUsers->execute();
        $customers = $stmtUsers->fetchAll(PDO::FETCH_ASSOC);

        // Calculate KPI metrics
        // Total Sales (Delivered orders sum. For mock demo, calculate dynamic sum + hardcoded base)
        $totalSalesVal = 0;
        foreach ($orders as $ord) {
            if ($ord['status'] === 'Delivered') {
                $totalSalesVal += ($ord['quantity'] * 20); // Assume avg Rs.20 per unit/sqft
            }
        }
        if ($totalSalesVal == 0) $totalSalesVal = 4200000; // default to 4.2M from mockup

        $totalOrdersCount = count($orders);
        $totalCustomersCount = count($customers);
        // Fetch low stock products
        $stmtLowStock = $pdo->prepare("SELECT COUNT(*) as low_stock_count FROM products WHERE CAST(stock AS UNSIGNED) < 100 AND stock != ''");
        $stmtLowStock->execute();
        $lowStockResult = $stmtLowStock->fetch(PDO::FETCH_ASSOC);
        $lowStockCount = $lowStockResult ? (int)$lowStockResult['low_stock_count'] : 0;

        echo json_encode([
            "success" => true,
            "metrics" => [
                "totalSales" => $totalSalesVal,
                "newOrders" => $totalOrdersCount,
                "newCustomers" => $totalCustomersCount,
                "lowStock" => $lowStockCount
            ],
            "orders" => $orders,
            "inquiries" => $messages,
            "customers" => $customers,
            "chatLeads" => $chatLeads
        ]);
    } else {
        // Fetch orders for this customer phone number
        $stmtOrders = $pdo->prepare("SELECT * FROM orders WHERE phone = ? ORDER BY created_at DESC");
        $stmtOrders->execute([$phone]);
        $orders = $stmtOrders->fetchAll(PDO::FETCH_ASSOC);

        // Fetch messages/inquiries for this customer phone number
        $stmtMsgs = $pdo->prepare("SELECT * FROM messages WHERE phone = ? ORDER BY created_at DESC");
        $stmtMsgs->execute([$phone]);
        $messages = $stmtMsgs->fetchAll(PDO::FETCH_ASSOC);

        // Mock Notifications
        $notifications = [
            [
                "id" => 1,
                "title" => "Welcome to Swastika Interlocking!",
                "body" => "Your portal is successfully activated.",
                "time" => "Just now",
                "unread" => true
            ]
        ];

        if (count($orders) > 0) {
            $notifications[] = [
                "id" => 2,
                "title" => "Order #" . $orders[0]['id'] . " Update",
                "body" => "Status: " . $orders[0]['status'],
                "time" => "2 hours ago",
                "unread" => true
            ];
        }

        echo json_encode([
            "success" => true,
            "user" => $user,
            "orders" => $orders,
            "inquiries" => $messages,
            "notifications" => $notifications
        ]);
    }

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>

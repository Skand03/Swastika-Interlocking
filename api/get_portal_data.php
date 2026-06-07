<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET');

if (!isset($_GET['phone']) || !isset($_GET['role'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing phone or role parameter."]);
    exit();
}

$phone = $_GET['phone'];
$role = $_GET['role'];

try {
    $dbFile = __DIR__ . '/database.db';
    $db = new PDO("sqlite:" . $dbFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verify user exists and check role
    $stmt = $db->prepare("SELECT id, full_name, phone, city, role FROM users WHERE phone = ?");
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
        $stmtOrders = $db->prepare("SELECT * FROM orders ORDER BY created_at DESC");
        $stmtOrders->execute();
        $orders = $stmtOrders->fetchAll(PDO::FETCH_ASSOC);

        // Fetch all contact messages/inquiries
        $stmtMsg = $db->prepare("SELECT * FROM messages ORDER BY created_at DESC");
        $stmtMsg->execute();
        $messages = $stmtMsg->fetchAll(PDO::FETCH_ASSOC);

        // Fetch all customers/users
        $stmtUsers = $db->prepare("SELECT id, full_name, phone, city, role, created_at FROM users WHERE role = 'customer' ORDER BY created_at DESC");
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
        $lowStockCount = 7; // Mock inventory low stock

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
            "customers" => $customers
        ]);
    } else {
        // Fetch orders for this customer phone number
        $stmtOrders = $db->prepare("SELECT * FROM orders WHERE phone = ? ORDER BY created_at DESC");
        $stmtOrders->execute([$phone]);
        $orders = $stmtOrders->fetchAll(PDO::FETCH_ASSOC);

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
            "notifications" => $notifications
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>

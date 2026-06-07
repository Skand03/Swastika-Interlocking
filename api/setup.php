<?php
header('Content-Type: application/json; charset=utf-8');

try {
    // Create connection to SQLite file-based database
    $dbFile = __DIR__ . '/database.db';
    $db = new PDO("sqlite:" . $dbFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create Users Table
    $db->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL UNIQUE,
        city TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Create Orders Table
    $db->exec("CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        city TEXT NOT NULL,
        product_type TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        address TEXT NOT NULL,
        special_req TEXT,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Create Contact Messages Table
    $db->exec("CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        requirements TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Seed test users if they don't exist
    $stmt = $db->prepare("SELECT COUNT(*) FROM users");
    $stmt->execute();
    $userCount = $stmt->fetchColumn();

    if ($userCount == 0) {
        // Seed customer Ramesh Kumar (phone: 9876543210, password: password)
        $stmtCustomer = $db->prepare("INSERT INTO users (full_name, phone, city, password, role) VALUES (?, ?, ?, ?, ?)");
        $stmtCustomer->execute(['Ramesh Kumar', '9876543210', 'Jaipur', 'password', 'customer']);

        // Seed admin (phone: 9999999999, password: admin)
        $stmtAdmin = $db->prepare("INSERT INTO users (full_name, phone, city, password, role) VALUES (?, ?, ?, ?, ?)");
        $stmtAdmin->execute(['Admin User', '9999999999', 'Ahmedabad', 'admin', 'admin']);
    }

    // Seed test orders for Ramesh Kumar and others if orders table is empty
    $stmt = $db->prepare("SELECT COUNT(*) FROM orders");
    $stmt->execute();
    $orderCount = $stmt->fetchColumn();

    if ($orderCount == 0) {
        $stmtOrder = $db->prepare("INSERT INTO orders (customer_name, phone, city, product_type, quantity, address, special_req, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        // Order 1 (Ramesh Kumar - Delivered)
        $stmtOrder->execute([
            'Ramesh Kumar', '9876543210', 'Jaipur', 'Z-Shape Interlocking (Grey) 80mm', 500, 
            '123 Industrial Area, Phase II, Jaipur, 302001', 'Heavy-duty driveway blocks required', 'Delivered', '2023-10-12 14:30:00'
        ]);

        // Order 2 (Ramesh Kumar - Pending)
        $stmtOrder->execute([
            'Ramesh Kumar', '9876543210', 'Jaipur', 'Heavy Duty Rectangular (Saffron) 60mm', 200, 
            '123 Industrial Area, Phase II, Jaipur, 302001', 'For garden walkway edging', 'Pending', '2023-10-28 09:15:00'
        ]);

        // Order 3 (Anita Singh - Processing)
        $stmtOrder->execute([
            'Anita Singh', '9111111111', 'Delhi', 'Heavy Duty Saffron Pavers', 1000, 
            'Sector 15, Dwarka, Delhi NCR', 'Require high strength M40 grade blocks', 'Processing', '2023-10-24 11:20:00'
        ]);

        // Order 4 (Modern Builders - Shipped)
        $stmtOrder->execute([
            'Modern Builders', '9222222222', 'Ahmedabad', 'Multiple Paver Items', 5000, 
            'GIDC Industrial Estate, Sanand, Ahmedabad', 'Bulk order pricing discount applied', 'Shipped', '2023-10-25 16:45:00'
        ]);
    }

    // Seed test contact messages if table is empty
    $stmt = $db->prepare("SELECT COUNT(*) FROM messages");
    $stmt->execute();
    $msgCount = $stmt->fetchColumn();

    if ($msgCount == 0) {
        $stmtMsg = $db->prepare("INSERT INTO messages (name, phone, requirements, created_at) VALUES (?, ?, ?, ?)");
        $stmtMsg->execute(['Anil Mehra', '9333333333', 'Price for 2000 zigzag blocks?', '2023-10-24 10:45:00']);
        $stmtMsg->execute(['Shikha Gupta', '9444444444', 'Delivery to Sanand possible?', '2023-10-24 09:30:00']);
        $stmtMsg->execute(['Modern Builders', '9222222222', 'Need catalog for interlocking tiles.', '2023-10-23 15:00:00']);
    }

    echo json_encode([
        "success" => true,
        "message" => "SQLite Database has been successfully set up with users, orders, and messages tables initialized.",
        "db_path" => $dbFile
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database Setup failed: " . $e->getMessage()
    ]);
}
?>

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
        order_id TEXT,
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

    // Create Products Table
    $db->exec("CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_key TEXT NOT NULL UNIQUE,
        name_en TEXT NOT NULL,
        name_hi TEXT NOT NULL,
        category TEXT NOT NULL,
        price TEXT NOT NULL,
        stock INTEGER DEFAULT 0,
        desc_en TEXT NOT NULL,
        desc_hi TEXT NOT NULL,
        image_url TEXT NOT NULL,
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

    // Seed default products if table is empty
    $stmt = $db->prepare("SELECT COUNT(*) FROM products");
    $stmt->execute();
    $prodCount = $stmt->fetchColumn();

    if ($prodCount == 0) {
        $stmtProd = $db->prepare("INSERT OR IGNORE INTO products (product_key, name_en, name_hi, category, price, stock, desc_en, desc_hi, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmtProd->execute(['pavers', 'Interlocking Paver Blocks', 'इंटरलॉकिंग पेवर ब्लॉक', 'Interlocking Blocks', '₹45 - ₹85 / sq.ft', 5000, 'Heavy-duty blocks suitable for driveways, pathways, and industrial yards. Available in multiple shapes and finishes.', 'ड्राइववे, रास्ते और औद्योगिक यार्ड के लिए उपयुक्त भारी-शुल्क ब्लॉक। कई आकृतियों और फ़िनिश में उपलब्ध।', '/images/interlocking-street-image-grey.jpg']);
        $stmtProd->execute(['bricks', 'Pertol Bricks', 'परतोल ईंटें', 'Interlocking Blocks', '₹45 - ₹85 / sq.ft', 3000, 'Heavy-duty interlocking bricks suitable for driveways, industrial yards, etc.', 'भारी-शुल्क परतोल ईंटें, ड्राइववे, औद्योगिक यार्ड के लिए उपयुक्त।', '/images/swastika-interlocking-pertol-bricks-grey.jpg']);
        $stmtProd->execute(['cement', 'Cement', 'सीमेंट', 'Raw Materials', '₹380 - ₹450 / bag', 1200, 'High-strength OPC and PPC cement from leading brands for all your construction requirements.', 'आपकी सभी निर्माण आवश्यकताओं के लिए अग्रणी ब्रांडों से उच्च-शक्ति ओपीसी और पीपीसी सीमेंट।', '/images/acc-opc-cement.webp']);
        $stmtProd->execute(['sand', 'River Sand (Plaster Sand)', 'नदी की रेत (Plaster Sand)', 'Raw Materials', '₹2,800 - ₹3,500 / truck', 40, 'Triple-washed, silt-free river sand perfect for plastering and concrete mixtures.', 'प्लास्टर और कंक्रीट मिक्स के लिए उपयुक्त मिट्टी-मुक्त तीन बार धुली हुई नदी की रेत।', '/images/white-sand.jpg']);
        $stmtProd->execute(['stone', 'Crushed Stone (Aggregate)', 'कुचला हुआ पत्थर (Aggregate)', 'Raw Materials', '₹1,200 - ₹1,800 / ton', 150, 'Available in 10mm, 20mm, and 40mm sizes. Ideal for concrete casting and road base.', '10mm, 20mm और 40mm आकार में उपलब्ध। कंक्रीट कास्टिंग और सड़क आधार के लिए आदर्श।', '/images/large-stone-gitti.jpg']);
        $stmtProd->execute(['pipes', 'Drainage Pipes (Hume Pipes)', 'निकासी पाइप (Hume Pipes)', 'Pipes & Drainage', '₹450 - ₹2,500 / unit', 80, 'High-density concrete pipes for efficient water management and sewage systems.', 'कुशल जल प्रबंधन और सीवेज प्रणालियों के लिए उच्च घनत्व वाले कंक्रीट पाइप।', '/images/pipe-large-size.jpg']);
        $stmtProd->execute(['rods', 'Construction Steel Rod', 'निर्माण स्टील रॉड (TMT Bars)', 'Raw Materials', 'Contact for Pricing', 200, 'High-quality TMT steel bars for structural reinforcement and construction purposes.', 'संरचनात्मक सुदृढीकरण और निर्माण के लिए उच्च गुणवत्ता वाले TMT स्टील बार।', '/images/steal-constrcution-rod.jpg']);
        $stmtProd->execute(['mild-steel', 'Mild Steel', 'माइल्ड स्टील', 'Raw Materials', 'Contact for Pricing', 180, 'High-quality mild steel in square and regular shapes for versatile construction and industrial applications.', 'विभिन्न निर्माण और औद्योगिक उपयोग के लिए उच्च गुणवत्ता वाला माइल्ड स्टील (स्क्वायर और रेगुलर)।', '/images/Mild-construction-steal.jpg']);
    }

    echo json_encode([
        "success" => true,
        "message" => "SQLite Database has been successfully set up with users, orders, messages, and products tables initialized.",
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

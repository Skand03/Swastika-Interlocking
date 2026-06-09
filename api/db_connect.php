<?php
// Secure PDO Database Connection file

$host = getenv('DB_HOST') ?: '127.0.0.1';
$db   = getenv('DB_NAME') ?: 'swastika_interlocking';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false, // Crucial for preventing SQL injection
];

    try {
        // Attempt MySQL connection
        $pdo = new PDO($dsn, $user, $pass, $options);
        // Ensure address, pincode, status, provider, last_login_at, and deleted_at columns exist (ignore errors if already present)
        try { $pdo->exec("ALTER TABLE users ADD COLUMN address TEXT NULL"); } catch (\PDOException $e) { }
        try { $pdo->exec("ALTER TABLE users ADD COLUMN pincode VARCHAR(20) NULL"); } catch (\PDOException $e) { }
        try { $pdo->exec("ALTER TABLE users ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active'"); } catch (\PDOException $e) { }
        try { $pdo->exec("ALTER TABLE users ADD COLUMN provider VARCHAR(30) DEFAULT 'email'"); } catch (\PDOException $e) { }
        try { $pdo->exec("ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL"); } catch (\PDOException $e) { }
        try { $pdo->exec("ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP NULL"); } catch (\PDOException $e) { }
        try { $pdo->exec("ALTER TABLE products ADD COLUMN variants TEXT NULL"); } catch (\PDOException $e) { }

        // Remove duplicates and add unique constraint on firebase_uid
        try {
            $pdo->exec("DELETE u1 FROM users u1 INNER JOIN users u2 WHERE u1.id < u2.id AND u1.firebase_uid = u2.firebase_uid AND u1.firebase_uid IS NOT NULL");
        } catch (\PDOException $e) { }
        try {
            $pdo->exec("ALTER TABLE users ADD UNIQUE KEY uk_firebase_uid (firebase_uid)");
        } catch (\PDOException $e) { }

        // Ensure audit_logs and failed_login_attempts tables exist
        $pdo->exec("CREATE TABLE IF NOT EXISTS audit_logs (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT(11) DEFAULT NULL,
            action VARCHAR(60) NOT NULL,
            firebase_uid VARCHAR(128) DEFAULT NULL,
            ip_address VARCHAR(45) DEFAULT NULL,
            user_agent TEXT DEFAULT NULL,
            detail TEXT DEFAULT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            KEY idx_user_id (user_id),
            KEY idx_action (action),
            KEY idx_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        $pdo->exec("CREATE TABLE IF NOT EXISTS failed_login_attempts (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            identifier VARCHAR(255) NOT NULL,
            ip_address VARCHAR(45) NOT NULL,
            attempt_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            KEY idx_identifier (identifier),
            KEY idx_ip (ip_address),
            KEY idx_time (attempt_time)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    } catch (\PDOException $e) {
    // FALLBACK FOR LOCAL DEVELOPMENT: If MySQL fails, use SQLite local file
    try {
        $pdo = new PDO('sqlite:' . __DIR__ . '/database.db');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Quick migration to add address and pincode if they don't exist
        try {
            $pdo->exec("ALTER TABLE users ADD COLUMN address text");
        } catch (\PDOException $e) { /* Column already exists */ }
        
        try {
            $pdo->exec("ALTER TABLE users ADD COLUMN pincode varchar(20)");
        } catch (\PDOException $e) { /* Column already exists */ }
        
        // Ensure local SQLite tables exist
        $pdo->exec("CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT,
            customer_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            city TEXT NOT NULL,
            product_type TEXT NOT NULL,
            quantity TEXT NOT NULL,
            address TEXT NOT NULL,
            special_req TEXT,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");

        // Add order_id column to orders if it does not exist (for existing tables)
        $q = $pdo->query("PRAGMA table_info(orders)");
        $cols = $q->fetchAll(PDO::FETCH_ASSOC);
        $hasOrderId = false;
        foreach ($cols as $c) {
            if ($c['name'] === 'order_id') {
                $hasOrderId = true;
                break;
            }
        }
        if (!$hasOrderId) {
            $pdo->exec("ALTER TABLE orders ADD COLUMN order_id TEXT");
            
            // Populate random order IDs for existing rows
            $rows = $pdo->query("SELECT id FROM orders")->fetchAll(PDO::FETCH_ASSOC);
            foreach ($rows as $r) {
                $randomId = "ORD-" . date('ymd') . "-" . rand(1000, 9999);
                $stmt = $pdo->prepare("UPDATE orders SET order_id = ? WHERE id = ?");
                $stmt->execute([$randomId, $r['id']]);
            }
        }
        // Add image_path column to orders if it does not exist (for storing site photos)
        $qImg = $pdo->query("PRAGMA table_info(orders)");
        $colsImg = $qImg->fetchAll(PDO::FETCH_ASSOC);
        $hasImg = false;
        foreach ($colsImg as $c) {
            if ($c['name'] === 'image_path') { $hasImg = true; break; }
        }
        if (!$hasImg) {
            $pdo->exec("ALTER TABLE orders ADD COLUMN image_path TEXT NULL");
        }

        $pdo->exec("CREATE TABLE IF NOT EXISTS chat_leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_ip TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            phone TEXT NOT NULL UNIQUE,
            city TEXT NOT NULL,
            password TEXT DEFAULT '',
            role TEXT DEFAULT 'customer',
            firebase_uid TEXT,
            email TEXT,
            status TEXT DEFAULT 'active',
            provider TEXT DEFAULT 'email',
            last_login_at DATETIME,
            deleted_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");

        // Ensure audit_logs and failed_login_attempts tables exist for SQLite
        $pdo->exec("CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action TEXT NOT NULL,
            firebase_uid TEXT,
            ip_address TEXT,
            user_agent TEXT,
            detail TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS failed_login_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            identifier TEXT NOT NULL,
            ip_address TEXT NOT NULL,
            attempt_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )");

        // Add columns dynamically to SQLite users table if they do not exist
        $userCols = $pdo->query("PRAGMA table_info(users)")->fetchAll(PDO::FETCH_ASSOC);
        $hasFirebaseUid = false;
        $hasEmail = false;
        $hasAddress = false;
        $hasPincode = false;
        $hasStatus = false;
        $hasProvider = false;
        $hasLastLoginAt = false;
        $hasDeletedAt = false;
        foreach ($userCols as $c) {
            if ($c['name'] === 'firebase_uid') $hasFirebaseUid = true;
            if ($c['name'] === 'email') $hasEmail = true;
            if ($c['name'] === 'address') $hasAddress = true;
            if ($c['name'] === 'pincode') $hasPincode = true;
            if ($c['name'] === 'status') $hasStatus = true;
            if ($c['name'] === 'provider') $hasProvider = true;
            if ($c['name'] === 'last_login_at') $hasLastLoginAt = true;
            if ($c['name'] === 'deleted_at') $hasDeletedAt = true;
        }
        if (!$hasFirebaseUid) { $pdo->exec("ALTER TABLE users ADD COLUMN firebase_uid TEXT"); }
        if (!$hasEmail) { $pdo->exec("ALTER TABLE users ADD COLUMN email TEXT"); }
        if (!$hasAddress) { $pdo->exec("ALTER TABLE users ADD COLUMN address TEXT"); }
        if (!$hasPincode) { $pdo->exec("ALTER TABLE users ADD COLUMN pincode TEXT"); }
        if (!$hasStatus) { $pdo->exec("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'"); }
        if (!$hasProvider) { $pdo->exec("ALTER TABLE users ADD COLUMN provider TEXT DEFAULT 'email'"); }
        if (!$hasLastLoginAt) { $pdo->exec("ALTER TABLE users ADD COLUMN last_login_at DATETIME"); }
        if (!$hasDeletedAt) { $pdo->exec("ALTER TABLE users ADD COLUMN deleted_at DATETIME"); }

            $pdo->exec("CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                requirements TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");
            // Ensure image_path column exists for inquiries with images
            $msgCols = $pdo->query("PRAGMA table_info(messages)")->fetchAll(PDO::FETCH_ASSOC);
            $hasImg = false;
            foreach ($msgCols as $c) { if ($c['name'] === 'image_path') { $hasImg = true; break; } }
            if (!$hasImg) { $pdo->exec("ALTER TABLE messages ADD COLUMN image_path TEXT NULL"); }

        $pdo->exec("CREATE TABLE IF NOT EXISTS products (
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
            variants TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");

        // Add variants column to products if it does not exist
        $qProducts = $pdo->query("PRAGMA table_info(products)");
        $colsProducts = $qProducts->fetchAll(PDO::FETCH_ASSOC);
        $hasVariants = false;
        foreach ($colsProducts as $c) {
            if ($c['name'] === 'variants') {
                $hasVariants = true;
                break;
            }
        }
        if (!$hasVariants) {
            $pdo->exec("ALTER TABLE products ADD COLUMN variants TEXT");
        }

    } catch (\PDOException $sqlite_error) {
        // If both fail, return a generic 500 error (do not leak DB credentials)
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database connection failed."]);
        exit;
    }
}
?>

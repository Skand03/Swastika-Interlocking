-- Swastika Interlocking - MySQL Database Schema
-- Run this script in phpMyAdmin or MySQL CLI to set up the production database.

CREATE DATABASE IF NOT EXISTS `swastika_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `swastika_db`;

-- 1. Users Table (Admin & Customers)
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL UNIQUE,
  `city` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT '', -- Optional: Firebase handles auth
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer',
  `firebase_uid` varchar(128) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_firebase_uid` (`firebase_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Orders & Enquiries Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(20) NOT NULL UNIQUE, -- e.g., ORD-168593
  `customer_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `city` varchar(100) NOT NULL,
  `product_type` varchar(100) NOT NULL,
  `quantity` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `special_req` text,
  `status` enum('Pending','Processing','Shipped','Delivered','Cancelled') DEFAULT 'Pending',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Chatbot Leads Table
CREATE TABLE IF NOT EXISTS `chat_leads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_ip` varchar(45) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Contact Messages/Inquiries Table
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `requirements` text NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Shuttering Inventory Table
CREATE TABLE IF NOT EXISTS `shuttering_inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_name` varchar(100) NOT NULL,
  `total_stock` int(11) NOT NULL DEFAULT 0,
  `rented_stock` int(11) NOT NULL DEFAULT 0,
  `price_per_day` decimal(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. RCC Projects Tracking
CREATE TABLE IF NOT EXISTS `rcc_projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` varchar(20) NOT NULL UNIQUE,
  `client_name` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `budget` decimal(12,2) NOT NULL,
  `status` enum('Planning','Ongoing','Completed') DEFAULT 'Planning',
  `start_date` date,
  `end_date` date,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (Password is 'admin' hashed with bcrypt)
INSERT IGNORE INTO `users` (`full_name`, `phone`, `city`, `password`, `role`) VALUES 
('Admin User', '9999999999', 'Ahmedabad', '$2y$10$k1Z6i6vCgq5g7N.yR1aQDuU9RfeH71VvP1d.eR9mQp9N9E7b4c6/2', 'admin');

-- 7. Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_key` varchar(50) NOT NULL UNIQUE,
  `name_en` varchar(150) NOT NULL,
  `name_hi` varchar(150) NOT NULL,
  `category` varchar(100) NOT NULL,
  `price` varchar(50) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `desc_en` text NOT NULL,
  `desc_hi` text NOT NULL,
  `image_url` text NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default products
INSERT IGNORE INTO `products` (`product_key`, `name_en`, `name_hi`, `category`, `price`, `stock`, `desc_en`, `desc_hi`, `image_url`) VALUES
('pavers', 'Interlocking Paver Blocks', 'इंटरलॉकिंग पेवर ब्लॉक', 'Interlocking Blocks', '₹45 - ₹85 / sq.ft', 5000, 'Heavy-duty blocks suitable for driveways, pathways, and industrial yards. Available in multiple shapes and finishes.', 'ड्राइववे, रास्ते और औद्योगिक यार्ड के लिए उपयुक्त भारी-शुल्क ब्लॉक। कई आकृतियों और फ़िनिश में उपलब्ध।', '/images/interlocking-street-image-grey.jpg'),
('bricks', 'Pertol Bricks', 'परतोल ईंटें', 'Interlocking Blocks', '₹45 - ₹85 / sq.ft', 3000, 'Heavy-duty interlocking bricks suitable for driveways, industrial yards, etc.', 'भारी-शुल्क परतोल ईंटें, ड्राइववे, औद्योगिक यार्ड के लिए उपयुक्त।', '/images/swastika-interlocking-pertol-bricks-grey.jpg'),
('cement', 'Cement', 'सीमेंट', 'Raw Materials', '₹380 - ₹450 / bag', 1200, 'High-strength OPC and PPC cement from leading brands for all your construction requirements.', 'आपकी सभी निर्माण आवश्यकताओं के लिए अग्रणी ब्रांडों से उच्च-शक्ति ओपीसी और पीपीसी सीमेंट।', '/images/acc-opc-cement.webp'),
('sand', 'River Sand (Plaster Sand)', 'नदी की रेत (Plaster Sand)', 'Raw Materials', '₹2,800 - ₹3,500 / truck', 40, 'Triple-washed, silt-free river sand perfect for plastering and concrete mixtures.', 'प्लास्टर और कंक्रीट मिक्स के लिए उपयुक्त मिट्टी-मुक्त तीन बार धुली हुई नदी की रेत।', '/images/white-sand.jpg'),
('stone', 'Crushed Stone (Aggregate)', 'कुचला हुआ पत्थर (Aggregate)', 'Raw Materials', '₹1,200 - ₹1,800 / ton', 150, 'Available in 10mm, 20mm, and 40mm sizes. Ideal for concrete casting and road base.', '10mm, 20mm और 40mm आकार में उपलब्ध। कंक्रीट कास्टिंग और सड़क आधार के लिए आदर्श।', '/images/large-stone-gitti.jpg'),
('pipes', 'Drainage Pipes (Hume Pipes)', 'निकासी पाइप (Hume Pipes)', 'Pipes & Drainage', '₹450 - ₹2,500 / unit', 80, 'High-density concrete pipes for efficient water management and sewage systems.', 'कुशल जल प्रबंधन और सीवेज प्रणालियों के लिए उच्च घनत्व वाले कंक्रीट पाइप।', '/images/pipe-large-size.jpg'),
('rods', 'Construction Steel Rod', 'निर्माण स्टील रॉड (TMT Bars)', 'Raw Materials', 'Contact for Pricing', 200, 'High-quality TMT steel bars for structural reinforcement and construction purposes.', 'संरचनात्मक सुदृढीकरण और निर्माण के लिए उच्च गुणवत्ता वाले TMT स्टील बार।', '/images/steal-constrcution-rod.jpg'),
('mild-steel', 'Mild Steel', 'माइल्ड स्टील', 'Raw Materials', 'Contact for Pricing', 180, 'High-quality mild steel in square and regular shapes for versatile construction and industrial applications.', 'विभिन्न निर्माण और औद्योगिक उपयोग के लिए उच्च गुणवत्ता वाला माइल्ड स्टील (स्क्वायर और रेगुलर)।', '/images/Mild-construction-steal.jpg');

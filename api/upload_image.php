<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($_FILES['image'])) {
    echo json_encode(["success" => false, "message" => "No image uploaded"]);
    exit;
}

$file = $_FILES['image'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "message" => "Upload error: " . $file['error']]);
    exit;
}

// Check if it's a valid image
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (strpos($mime, 'image/') !== 0) {
    echo json_encode(["success" => false, "message" => "Invalid file type. Only images are allowed."]);
    exit;
}

// Generate unique filename
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('img_') . '.' . $ext;

$uploadDir = __DIR__ . '/../images/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$targetPath = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode([
        "success" => true, 
        "message" => "Image uploaded successfully",
        "url" => "/images/uploads/" . $filename
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to move uploaded file"]);
}
?>

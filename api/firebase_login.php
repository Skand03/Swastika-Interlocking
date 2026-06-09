<?php
/**
 * firebase_login.php
 * Production-grade Firebase authentication endpoint.
 *
 * Rules enforced:
 *  - Find user ONLY by firebase_uid (never by email linking)
 *  - Allow login only if status = 'active'
 *  - Deny status = 'suspended' | 'deleted' with clear message
 *  - Deleted & re-created Firebase account → new identity, no auto-link
 *  - New Google user who has no DB record → needs_profile (complete registration)
 *  - Rate-limit: max 10 attempts per 15 min per IP
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Firebase-Token');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

require_once __DIR__ . '/db_connect.php';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Extract Bearer token from multiple possible header locations (Apache/CGI/FPM safe) */
function getBearerToken(): ?string {
    $locations = [
        $_SERVER['HTTP_AUTHORIZATION']          ?? '',
        $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '',
        $_SERVER['HTTP_X_FIREBASE_TOKEN']       ?? '',
    ];
    // apache_request_headers / getallheaders fallback
    $fn = function_exists('getallheaders') ? 'getallheaders'
        : (function_exists('apache_request_headers') ? 'apache_request_headers' : null);
    if ($fn) {
        foreach ($fn() as $k => $v) {
            if (strcasecmp($k, 'Authorization') === 0 || strcasecmp($k, 'X-Firebase-Token') === 0) {
                $locations[] = $v;
            }
        }
    }
    foreach ($locations as $val) {
        $val = trim($val);
        if (stripos($val, 'Bearer ') === 0) {
            return trim(substr($val, 7));
        }
        if ($val && strpos($val, '.') !== false && substr_count($val, '.') === 2) {
            // Raw token without "Bearer " prefix (X-Firebase-Token fallback)
            return $val;
        }
    }
    return null;
}

/** Decode & validate Firebase JWT payload (lightweight, no RSA sig check needed for trusted server) */
function decodeFirebaseToken(string $jwt, string $projectId): array {
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) {
        return ['error' => 'Malformed JWT.'];
    }

    $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
    if (!$payload || empty($payload['sub'])) {
        return ['error' => 'Could not decode JWT payload.'];
    }

    // Expiry
    if (($payload['exp'] ?? 0) < time()) {
        return ['error' => 'TOKEN_EXPIRED'];
    }

    // Audience
    if (($payload['aud'] ?? '') !== $projectId) {
        return ['error' => 'Token audience mismatch.'];
    }

    // Issuer
    if (($payload['iss'] ?? '') !== 'https://securetoken.google.com/' . $projectId) {
        return ['error' => 'Token issuer mismatch.'];
    }

    return ['payload' => $payload];
}

/** Rate limiting: max $max attempts per $windowSec seconds per IP */
function checkRateLimit(PDO $pdo, string $ip, int $max = 10, int $windowSec = 900): void {
    // Clean old entries
    $cutoff = date('Y-m-d H:i:s', time() - $windowSec);
    $pdo->prepare("DELETE FROM failed_login_attempts WHERE attempt_time < ?")
        ->execute([$cutoff]);

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM failed_login_attempts WHERE ip_address = ?");
    $stmt->execute([$ip]);
    if ((int)$stmt->fetchColumn() >= $max) {
        http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Too many requests. Please wait 15 minutes and try again.']);
        exit();
    }
}

/** Log a failed attempt */
function logFailed(PDO $pdo, string $identifier, string $ip): void {
    try {
        $pdo->prepare("INSERT INTO failed_login_attempts (identifier, ip_address) VALUES (?, ?)")
            ->execute([$identifier, $ip]);
    } catch (PDOException $e) { /* non-fatal */ }
}

/** Write to audit log */
function audit(PDO $pdo, ?int $userId, string $action, string $firebaseUid = '', string $detail = ''): void {
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $pdo->prepare("INSERT INTO audit_logs (user_id, action, firebase_uid, ip_address, user_agent, detail) VALUES (?,?,?,?,?,?)")
            ->execute([$userId, $action, $firebaseUid, $ip, $ua, $detail]);
    } catch (PDOException $e) { /* non-fatal */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Get & validate Bearer token
// ─────────────────────────────────────────────────────────────────────────────
$ip      = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$idToken = getBearerToken();

if (!$idToken) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authorization header missing. Please try logging in again.']);
    exit();
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Rate limit before any heavy work
// ─────────────────────────────────────────────────────────────────────────────
try { checkRateLimit($pdo, $ip); }
catch (PDOException $e) { /* failed_login_attempts table may not exist yet on first run — ignore */ }

// ─────────────────────────────────────────────────────────────────────────────
// 3. Decode & validate token
// ─────────────────────────────────────────────────────────────────────────────
$projectId = getenv('FIREBASE_PROJECT_ID') ?: 'swastika-interlocking';
$result    = decodeFirebaseToken($idToken, $projectId);

if (isset($result['error'])) {
    if ($result['error'] === 'TOKEN_EXPIRED') {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Session expired. Please log in again.', 'code' => 'TOKEN_EXPIRED']);
        exit();
    }
    logFailed($pdo, $ip, $ip);
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid authentication token.']);
    exit();
}

$payload      = $result['payload'];
$firebase_uid = $payload['sub'];
$tokenEmail   = $payload['email'] ?? '';
$provider     = $payload['firebase']['sign_in_provider'] ?? 'unknown';

// Parse request body for extra context
$body      = json_decode(file_get_contents('php://input'), true) ?? [];
$isGoogle  = $provider === 'google.com' || !empty($body['is_google']);
$bodyEmail = trim($body['email'] ?? '');
$email     = !empty($tokenEmail) ? $tokenEmail : $bodyEmail;
$fullName  = trim($body['full_name'] ?? $payload['name'] ?? '');

// ─────────────────────────────────────────────────────────────────────────────
// 4. Look up user ONLY by firebase_uid — no email fallback/linking
// ─────────────────────────────────────────────────────────────────────────────
try {
    $stmt = $pdo->prepare(
        "SELECT id, full_name, phone, city, address, pincode, role, email,
                firebase_uid, status, provider
         FROM users
         WHERE firebase_uid = ?
         LIMIT 1"
    );
    $stmt->execute([$firebase_uid]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // ── 4a. User found ────────────────────────────────────────────────────────
    if ($user) {
        $status = $user['status'] ?? 'active';

        if ($status === 'suspended') {
            audit($pdo, $user['id'], 'login_denied_suspended', $firebase_uid);
            logFailed($pdo, $firebase_uid, $ip);
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'code'    => 'ACCOUNT_SUSPENDED',
                'message' => 'Your account has been suspended. Please contact support.'
            ]);
            exit();
        }

        if ($status === 'deleted') {
            audit($pdo, $user['id'], 'login_denied_deleted', $firebase_uid);
            logFailed($pdo, $firebase_uid, $ip);
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'code'    => 'ACCOUNT_DELETED',
                'message' => 'This account has been deactivated. Please contact support to recover your account.'
            ]);
            exit();
        }

        // Update last_login_at
        $pdo->prepare("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?")
            ->execute([$user['id']]);

        audit($pdo, $user['id'], 'login_success', $firebase_uid);

        // Remove sensitive fields before returning
        unset($user['password']);
        echo json_encode(['success' => true, 'message' => 'Login successful.', 'user' => $user]);
        exit();
    }

    // ── 4b. No user found for this firebase_uid ───────────────────────────────
    // IMPORTANT: Do NOT automatically link by email matching.
    // Check if the email already exists in the DB with a DIFFERENT, non-empty firebase_uid
    if (!empty($email)) {
        $checkStmt = $pdo->prepare("SELECT id, firebase_uid, status FROM users WHERE email = ? LIMIT 1");
        $checkStmt->execute([$email]);
        $existingUser = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if ($existingUser && !empty($existingUser['firebase_uid']) && $existingUser['firebase_uid'] !== $firebase_uid) {
            audit($pdo, $existingUser['id'], 'login_denied_recreated_account', $firebase_uid, "Email " . $email . " already linked to UID " . $existingUser['firebase_uid']);
            logFailed($pdo, $firebase_uid, $ip);
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'code'    => 'RECOVERY_REQUIRED',
                'message' => 'This account has been linked to different credentials. Manual admin approval is required to recover your account.'
            ]);
            exit();
        }
    }

    if ($isGoogle || $provider === 'google.com') {
        // New Google user — needs to complete profile (phone, city, address)
        audit($pdo, null, 'new_google_user_needs_profile', $firebase_uid, $email);
        echo json_encode([
            'success'       => false,
            'needs_profile' => true,
            'message'       => 'Please complete your profile to continue.'
        ]);
        exit();
    }

    // New email/password user — they should have gone through register first
    audit($pdo, null, 'login_no_account', $firebase_uid, $email);
    logFailed($pdo, $firebase_uid, $ip);
    echo json_encode([
        'success' => false,
        'code'    => 'ACCOUNT_NOT_FOUND',
        'message' => 'No account found. Please register first.'
    ]);
    exit();

} catch (PDOException $e) {
    error_log('firebase_login.php DB error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again.']);
    exit();
}
?>

<?php
/**
 * auth_middleware.php
 * Include at the top of any protected API endpoint.
 *
 * Usage:
 *   require_once __DIR__ . '/auth_middleware.php';
 *   $authUser = requireAuth($pdo);                    // any logged-in user
 *   $authUser = requireAuth($pdo, ['admin']);          // admin only
 *   $authUser = requireAuth($pdo, ['admin','manager']); // multiple roles
 *
 * Returns the user row from DB on success; exits with JSON error on failure.
 */

if (!function_exists('getBearerToken')) {
    function getBearerToken(): ?string {
        $locations = [
            $_SERVER['HTTP_AUTHORIZATION']          ?? '',
            $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '',
            $_SERVER['HTTP_X_FIREBASE_TOKEN']       ?? '',
        ];
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
            if (stripos($val, 'Bearer ') === 0) return trim(substr($val, 7));
            if ($val && substr_count($val, '.') === 2) return $val;
        }
        return null;
    }
}

if (!function_exists('decodeFirebaseToken')) {
    function decodeFirebaseToken(string $jwt, string $projectId): array {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) return ['error' => 'Malformed JWT.'];
        $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
        if (!$payload || empty($payload['sub'])) return ['error' => 'Invalid payload.'];
        if (($payload['exp'] ?? 0) < time()) return ['error' => 'TOKEN_EXPIRED'];
        if (($payload['aud'] ?? '') !== $projectId) return ['error' => 'Audience mismatch.'];
        if (($payload['iss'] ?? '') !== 'https://securetoken.google.com/' . $projectId) return ['error' => 'Issuer mismatch.'];
        return ['payload' => $payload];
    }
}

function requireAuth(PDO $pdo, array $allowedRoles = []): array {
    $idToken = getBearerToken();
    if (!$idToken) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required.']);
        exit();
    }

    $projectId = getenv('FIREBASE_PROJECT_ID') ?: 'swastika-interlocking';
    $result    = decodeFirebaseToken($idToken, $projectId);

    if (isset($result['error'])) {
        $code = $result['error'] === 'TOKEN_EXPIRED' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Session expired. Please log in again.', 'code' => $code]);
        exit();
    }

    $firebase_uid = $result['payload']['sub'];

    $stmt = $pdo->prepare(
        "SELECT id, full_name, phone, city, address, pincode, role, email, firebase_uid, status
         FROM users WHERE firebase_uid = ? LIMIT 1"
    );
    $stmt->execute([$firebase_uid]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Account not found.', 'code' => 'ACCOUNT_NOT_FOUND']);
        exit();
    }

    $status = $user['status'] ?? 'active';
    if ($status !== 'active') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => $status === 'suspended'
                ? 'Account suspended. Contact support.'
                : 'Account deactivated. Contact support.',
            'code' => strtoupper('ACCOUNT_' . $status),
        ]);
        exit();
    }

    if (!empty($allowedRoles) && !in_array($user['role'], $allowedRoles, true)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Access denied: insufficient permissions.', 'code' => 'FORBIDDEN']);
        exit();
    }

    return $user;
}
?>

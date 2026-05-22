<?php
/**
 * User Login API
 * Authenticates user credentials and returns user data
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/Database.php';

try {
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['username']) || !isset($input['password'])) {
        throw new Exception('Username and password are required');
    }

    $username = $input['username'];
    $password = $input['password'];

    // Get database instance
    $db = Database::getInstance();

    if (!$db->isConnected()) {
        throw new Exception('Database connection failed');
    }

    // Query user by username
    $sql = "SELECT * FROM users WHERE username = ? LIMIT 1";
    $result = $db->query($sql, [$username], "s");

    if ($result->num_rows === 0) {
        throw new Exception('Invalid username or password');
    }

    $user = $result->fetch_assoc();

    // Check if account is active
    if ($user['status'] !== 'Active') {
        throw new Exception('Account is inactive. Please contact administrator.');
    }

    // Verify password (in production, use password_verify with hashed passwords)
    if ($user['password'] !== $password) {
        throw new Exception('Invalid username or password');
    }

    // Update last login
    $updateSql = "UPDATE users SET last_login = NOW() WHERE user_id = ?";
    $db->query($updateSql, [$user['user_id']], "i");

    // Remove password from response
    unset($user['password']);

    // Update last_login in response
    $user['last_login'] = date('Y-m-d H:i:s');

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'data' => $user
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

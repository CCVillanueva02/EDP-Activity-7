<?php
/**
 * Create User API
 * Add new user account
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

    // Validate required fields
    $required = ['username', 'password', 'email', 'full_name', 'role', 'status'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            throw new Exception("Field '{$field}' is required");
        }
    }

    $username = $input['username'];
    $password = $input['password'];
    $email = $input['email'];
    $fullName = $input['full_name'];
    $role = $input['role'];
    $status = $input['status'];

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // Validate role
    $validRoles = ['Admin', 'Staff', 'Dentist'];
    if (!in_array($role, $validRoles)) {
        throw new Exception('Invalid role');
    }

    // Validate status
    $validStatuses = ['Active', 'Inactive'];
    if (!in_array($status, $validStatuses)) {
        throw new Exception('Invalid status');
    }

    // Get database instance
    $db = Database::getInstance();

    // Check if username already exists
    $checkSql = "SELECT user_id FROM users WHERE username = ? LIMIT 1";
    $checkResult = $db->query($checkSql, [$username], "s");
    if ($checkResult->num_rows > 0) {
        throw new Exception('Username already exists');
    }

    // Check if email already exists
    $checkEmailSql = "SELECT user_id FROM users WHERE email = ? LIMIT 1";
    $checkEmailResult = $db->query($checkEmailSql, [$email], "s");
    if ($checkEmailResult->num_rows > 0) {
        throw new Exception('Email already exists');
    }

    // In production, hash the password
    // $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $sql = "INSERT INTO users (username, password, email, full_name, role, status)
            VALUES (?, ?, ?, ?, ?, ?)";
    $result = $db->query($sql, [$username, $password, $email, $fullName, $role, $status], "ssssss");

    if ($result->insert_id > 0) {
        // Get the newly created user
        $getUserSql = "SELECT user_id, username, email, full_name, role, status, created_at
                       FROM users WHERE user_id = ?";
        $userResult = $db->query($getUserSql, [$result->insert_id], "i");
        $newUser = $userResult->fetch_assoc();

        echo json_encode([
            'success' => true,
            'message' => 'User created successfully',
            'data' => $newUser
        ]);
    } else {
        throw new Exception('Failed to create user');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

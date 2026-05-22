<?php
/**
 * Update User API
 * Update existing user account
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, POST');
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
    if (!isset($input['user_id'])) {
        throw new Exception('User ID is required');
    }

    $userId = $input['user_id'];
    $username = $input['username'] ?? null;
    $email = $input['email'] ?? null;
    $fullName = $input['full_name'] ?? null;
    $role = $input['role'] ?? null;
    $status = $input['status'] ?? null;

    // Get database instance
    $db = Database::getInstance();

    // Check if user exists
    $checkSql = "SELECT user_id FROM users WHERE user_id = ?";
    $checkResult = $db->query($checkSql, [$userId], "i");
    if ($checkResult->num_rows === 0) {
        throw new Exception('User not found');
    }

    // Build update query dynamically
    $updateFields = [];
    $params = [];
    $types = "";

    if ($username !== null) {
        // Check if new username is already taken by another user
        $checkUsernameSql = "SELECT user_id FROM users WHERE username = ? AND user_id != ?";
        $checkUsernameResult = $db->query($checkUsernameSql, [$username, $userId], "si");
        if ($checkUsernameResult->num_rows > 0) {
            throw new Exception('Username already exists');
        }
        $updateFields[] = "username = ?";
        $params[] = $username;
        $types .= "s";
    }

    if ($email !== null) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format');
        }
        // Check if new email is already taken by another user
        $checkEmailSql = "SELECT user_id FROM users WHERE email = ? AND user_id != ?";
        $checkEmailResult = $db->query($checkEmailSql, [$email, $userId], "si");
        if ($checkEmailResult->num_rows > 0) {
            throw new Exception('Email already exists');
        }
        $updateFields[] = "email = ?";
        $params[] = $email;
        $types .= "s";
    }

    if ($fullName !== null) {
        $updateFields[] = "full_name = ?";
        $params[] = $fullName;
        $types .= "s";
    }

    if ($role !== null) {
        $validRoles = ['Admin', 'Staff', 'Dentist'];
        if (!in_array($role, $validRoles)) {
            throw new Exception('Invalid role');
        }
        $updateFields[] = "role = ?";
        $params[] = $role;
        $types .= "s";
    }

    if ($status !== null) {
        $validStatuses = ['Active', 'Inactive'];
        if (!in_array($status, $validStatuses)) {
            throw new Exception('Invalid status');
        }
        $updateFields[] = "status = ?";
        $params[] = $status;
        $types .= "s";
    }

    if (empty($updateFields)) {
        throw new Exception('No fields to update');
    }

    // Add user_id to params
    $params[] = $userId;
    $types .= "i";

    // Execute update
    $sql = "UPDATE users SET " . implode(", ", $updateFields) . " WHERE user_id = ?";
    $result = $db->query($sql, $params, $types);

    // Get updated user data
    $getUserSql = "SELECT user_id, username, email, full_name, role, status, created_at, last_login
                   FROM users WHERE user_id = ?";
    $userResult = $db->query($getUserSql, [$userId], "i");
    $updatedUser = $userResult->fetch_assoc();

    echo json_encode([
        'success' => true,
        'message' => 'User updated successfully',
        'data' => $updatedUser
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

<?php
/**
 * Password Recovery API
 * Handles password reset requests
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

    $action = $input['action'] ?? '';

    if ($action === 'verify-email') {
        // Step 1: Verify email exists
        if (!isset($input['email'])) {
            throw new Exception('Email is required');
        }

        $email = $input['email'];

        // Get database instance
        $db = Database::getInstance();

        // Query user by email
        $sql = "SELECT user_id, email, full_name FROM users WHERE email = ? LIMIT 1";
        $result = $db->query($sql, [$email], "s");

        if ($result->num_rows === 0) {
            throw new Exception('Email address not found in our system');
        }

        $user = $result->fetch_assoc();

        echo json_encode([
            'success' => true,
            'message' => 'Email verified successfully',
            'data' => [
                'email' => $user['email'],
                'full_name' => $user['full_name']
            ]
        ]);

    } elseif ($action === 'reset-password') {
        // Step 2: Reset password
        if (!isset($input['email']) || !isset($input['newPassword'])) {
            throw new Exception('Email and new password are required');
        }

        $email = $input['email'];
        $newPassword = $input['newPassword'];

        // Password validation
        if (strlen($newPassword) < 6) {
            throw new Exception('Password must be at least 6 characters long');
        }

        // Get database instance
        $db = Database::getInstance();

        // In production, hash the password
        // $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        // Update password
        $sql = "UPDATE users SET password = ? WHERE email = ?";
        $result = $db->query($sql, [$newPassword, $email], "ss");

        if ($result->affected_rows === 0) {
            throw new Exception('Failed to update password');
        }

        echo json_encode([
            'success' => true,
            'message' => 'Password reset successfully'
        ]);

    } else {
        throw new Exception('Invalid action');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

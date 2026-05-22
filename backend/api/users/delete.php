<?php
/**
 * Delete User API
 * Remove user account
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/Database.php';

try {
    // Get user_id from query string or POST data
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $userId = $_GET['user_id'] ?? null;
    } else {
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['user_id'] ?? null;
    }

    if (!$userId) {
        throw new Exception('User ID is required');
    }

    // Get database instance
    $db = Database::getInstance();

    // Check if user exists
    $checkSql = "SELECT user_id, username FROM users WHERE user_id = ?";
    $checkResult = $db->query($checkSql, [$userId], "i");

    if ($checkResult->num_rows === 0) {
        throw new Exception('User not found');
    }

    $user = $checkResult->fetch_assoc();

    // Delete user
    $sql = "DELETE FROM users WHERE user_id = ?";
    $result = $db->query($sql, [$userId], "i");

    if ($result->affected_rows > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'User deleted successfully',
            'data' => [
                'user_id' => $userId,
                'username' => $user['username']
            ]
        ]);
    } else {
        throw new Exception('Failed to delete user');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

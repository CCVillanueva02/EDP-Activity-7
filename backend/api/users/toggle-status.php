<?php
/**
 * Toggle User Status API
 * Activate or deactivate user account
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

    if (!isset($input['user_id'])) {
        throw new Exception('User ID is required');
    }

    $userId = $input['user_id'];

    // Get database instance
    $db = Database::getInstance();

    // Get current status
    $getSql = "SELECT status FROM users WHERE user_id = ?";
    $getResult = $db->query($getSql, [$userId], "i");

    if ($getResult->num_rows === 0) {
        throw new Exception('User not found');
    }

    $user = $getResult->fetch_assoc();
    $currentStatus = $user['status'];

    // Toggle status
    $newStatus = ($currentStatus === 'Active') ? 'Inactive' : 'Active';

    // Update status
    $updateSql = "UPDATE users SET status = ? WHERE user_id = ?";
    $result = $db->query($updateSql, [$newStatus, $userId], "si");

    if ($result->affected_rows > 0) {
        // Get updated user data
        $getUserSql = "SELECT user_id, username, email, full_name, role, status, created_at, last_login
                       FROM users WHERE user_id = ?";
        $userResult = $db->query($getUserSql, [$userId], "i");
        $updatedUser = $userResult->fetch_assoc();

        echo json_encode([
            'success' => true,
            'message' => "User status changed to {$newStatus}",
            'data' => $updatedUser
        ]);
    } else {
        throw new Exception('Failed to update status');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

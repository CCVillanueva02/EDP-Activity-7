<?php
/**
 * User List API
 * Get all users with optional search
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../config/Database.php';

try {
    // Get search parameter
    $search = $_GET['search'] ?? '';

    // Get database instance
    $db = Database::getInstance();

    if (!$db->isConnected()) {
        throw new Exception('Database connection failed');
    }

    // Build query
    if (!empty($search)) {
        $sql = "SELECT user_id, username, email, full_name, role, status, created_at, last_login
                FROM users
                WHERE username LIKE ? OR email LIKE ? OR full_name LIKE ?
                ORDER BY user_id DESC";
        $searchTerm = "%{$search}%";
        $result = $db->query($sql, [$searchTerm, $searchTerm, $searchTerm], "sss");
    } else {
        $sql = "SELECT user_id, username, email, full_name, role, status, created_at, last_login
                FROM users
                ORDER BY user_id DESC";
        $result = $db->query($sql);
    }

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode([
        'success' => true,
        'data' => $users,
        'count' => count($users)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

<?php
/**
 * Test Database Connection
 * Simple script to verify MySQL connection
 */

require_once 'config/Database.php';

header('Content-Type: application/json');

try {
    // Get database instance
    $db = Database::getInstance();

    // Check connection
    if (!$db->isConnected()) {
        throw new Exception('Failed to connect to database');
    }

    // Test query
    $result = $db->query("SELECT 1 + 1 AS result");
    $row = $result->fetch_assoc();

    // Get database info
    $versionResult = $db->query("SELECT VERSION() as version");
    $versionRow = $versionResult->fetch_assoc();

    // Get tables
    $tablesResult = $db->query("SHOW TABLES");
    $tables = [];
    while ($tableRow = $tablesResult->fetch_row()) {
        $tables[] = $tableRow[0];
    }

    // Get user count
    $userCountResult = $db->query("SELECT COUNT(*) as count FROM users");
    $userCount = $userCountResult->fetch_assoc()['count'];

    echo json_encode([
        'success' => true,
        'message' => 'Database connection successful',
        'data' => [
            'connected' => true,
            'test_query' => $row['result'],
            'mysql_version' => $versionRow['version'],
            'database' => 'clinic_db',
            'tables' => $tables,
            'user_count' => $userCount
        ]
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'data' => [
            'connected' => false
        ]
    ], JSON_PRETTY_PRINT);
}
?>

<?php
/**
 * Dental Clinic Management System - Backend
 * Main API Entry Point
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'success' => true,
    'message' => 'Dental Clinic Management System API',
    'version' => '1.0.0',
    'endpoints' => [
        'auth' => [
            'POST /api/auth/login.php' => 'User login',
            'POST /api/auth/password-recovery.php' => 'Password recovery'
        ],
        'users' => [
            'GET /api/users/list.php' => 'List all users',
            'POST /api/users/create.php' => 'Create new user',
            'PUT /api/users/update.php' => 'Update user',
            'DELETE /api/users/delete.php' => 'Delete user',
            'POST /api/users/toggle-status.php' => 'Toggle user status'
        ]
    ],
    'database' => [
        'class' => 'Database (Singleton)',
        'location' => '/config/Database.php',
        'type' => 'MySQL'
    ]
]);
?>

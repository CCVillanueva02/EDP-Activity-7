# Dental Clinic Management System - PHP Backend

## Overview
Complete PHP backend with MySQL integration for the Dental Clinic Management System.

## Features

### 1. Public Database Connection Class (Singleton)
**Location:** `backend/config/Database.php`

**Class:** `Database`

**Methods:**
- `getInstance()` - Get singleton instance
- `getConnection()` - Get MySQL connection object
- `isConnected()` - Check if connected
- `query($sql, $params, $types)` - Execute prepared statements
- `beginTransaction()` - Start transaction
- `commit()` - Commit transaction
- `rollback()` - Rollback transaction
- `escapeString($string)` - Escape special characters
- `disconnect()` - Close connection

**Usage Example:**
```php
require_once 'config/Database.php';

// Get database instance
$db = Database::getInstance();

// Check connection
if ($db->isConnected()) {
    // Execute query
    $result = $db->query(
        "SELECT * FROM users WHERE username = ?",
        [$username],
        "s"  // s = string, i = integer, d = double, b = blob
    );
}
```

### 2. Authentication APIs

#### Login API
**Endpoint:** `POST /backend/api/auth/login.php`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user_id": 1,
    "username": "admin",
    "email": "admin@dentalclinic.com",
    "full_name": "System Administrator",
    "role": "Admin",
    "status": "Active",
    "last_login": "2026-05-10 14:30:00"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

#### Password Recovery API
**Endpoint:** `POST /backend/api/auth/password-recovery.php`

**Step 1 - Verify Email:**
```json
{
  "action": "verify-email",
  "email": "admin@dentalclinic.com"
}
```

**Step 2 - Reset Password:**
```json
{
  "action": "reset-password",
  "email": "admin@dentalclinic.com",
  "newPassword": "newpass123"
}
```

### 3. User Management APIs

#### List Users
**Endpoint:** `GET /backend/api/users/list.php?search=admin`

**Response:**
```json
{
  "success": true,
  "data": [...users],
  "count": 10
}
```

#### Create User
**Endpoint:** `POST /backend/api/users/create.php`

**Request:**
```json
{
  "username": "newuser",
  "password": "pass123",
  "email": "user@example.com",
  "full_name": "New User",
  "role": "Staff",
  "status": "Active"
}
```

#### Update User
**Endpoint:** `PUT /backend/api/users/update.php`

**Request:**
```json
{
  "user_id": 5,
  "username": "updateduser",
  "email": "updated@example.com",
  "full_name": "Updated Name",
  "role": "Dentist",
  "status": "Active"
}
```

#### Delete User
**Endpoint:** `DELETE /backend/api/users/delete.php?user_id=5`

or

**POST:** `/backend/api/users/delete.php`
```json
{
  "user_id": 5
}
```

#### Toggle User Status
**Endpoint:** `POST /backend/api/users/toggle-status.php`

**Request:**
```json
{
  "user_id": 5
}
```

## Installation & Setup

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- mod_rewrite enabled

### Step 1: Database Configuration
Edit `backend/config/Database.php`:

```php
private $host = "localhost";        // Your MySQL host
private $username = "root";         // Your MySQL username
private $password = "";             // Your MySQL password
private $database = "clinic_db";    // Your database name
private $port = 3306;               // MySQL port
```

### Step 2: Create Database
Run the SQL schema:

```bash
mysql -u root -p < DATABASE_SCHEMA.sql
```

Or import via phpMyAdmin.

### Step 3: Configure Web Server

#### Apache (.htaccess)
Already included in `backend/.htaccess`

#### Nginx Configuration
```nginx
location /backend {
    try_files $uri $uri/ /backend/index.php?$args;
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
    }
}
```

### Step 4: Set Permissions

```bash
chmod 755 backend
chmod 644 backend/.htaccess
chmod 755 backend/api
chmod 755 backend/config
```

### Step 5: Test Connection

Visit: `http://localhost/backend/test-connection.php`

Expected output:
```json
{
  "success": true,
  "message": "Database connection successful",
  "data": {
    "connected": true,
    "test_query": 2,
    "mysql_version": "8.0.32",
    "database": "clinic_db",
    "tables": [
      "users",
      "patients",
      "dentists",
      "services",
      "appointments",
      "payments"
    ],
    "user_count": 4
  }
}
```

## API Testing

### Using cURL

#### Login:
```bash
curl -X POST http://localhost/backend/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### Create User:
```bash
curl -X POST http://localhost/backend/api/users/create.php \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123",
    "email": "test@example.com",
    "full_name": "Test User",
    "role": "Staff",
    "status": "Active"
  }'
```

#### List Users:
```bash
curl -X GET "http://localhost/backend/api/users/list.php?search=admin"
```

### Using Postman

1. Create new request
2. Set method (POST, GET, PUT, DELETE)
3. Enter URL: `http://localhost/backend/api/...`
4. Add Headers: `Content-Type: application/json`
5. Add Body (for POST/PUT): JSON data
6. Send request

## Security Features

### 1. Prepared Statements
All queries use prepared statements to prevent SQL injection:
```php
$db->query("SELECT * FROM users WHERE username = ?", [$username], "s");
```

### 2. Input Validation
- Email format validation
- Required field checks
- Role and status validation
- Unique username/email checks

### 3. Password Hashing (Production)
Uncomment password hashing in production:
```php
// In create.php and password-recovery.php
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// In login.php
if (!password_verify($password, $user['password'])) {
    throw new Exception('Invalid password');
}
```

### 4. CORS Headers
Enable cross-origin requests for frontend integration.

### 5. Error Logging
All errors are logged:
```php
error_log("Database connection error: " . $e->getMessage());
```

## Directory Structure

```
backend/
├── config/
│   └── Database.php          (Public Database Class)
├── api/
│   ├── auth/
│   │   ├── login.php         (Login endpoint)
│   │   └── password-recovery.php
│   └── users/
│       ├── list.php          (List users)
│       ├── create.php        (Create user)
│       ├── update.php        (Update user)
│       ├── delete.php        (Delete user)
│       └── toggle-status.php (Toggle status)
├── .htaccess                 (Apache config)
├── index.php                 (API info)
└── test-connection.php       (Test script)
```

## Error Handling

All APIs return consistent error responses:

```json
{
  "success": false,
  "message": "Error description here"
}
```

HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

## Production Deployment

### 1. Enable Password Hashing
Uncomment `password_hash()` and `password_verify()` in:
- `api/auth/login.php`
- `api/users/create.php`
- `api/auth/password-recovery.php`

### 2. Disable Error Display
```php
ini_set('display_errors', 0);
error_reporting(0);
```

### 3. Use Environment Variables
```php
// config/Database.php
private $host = getenv('DB_HOST') ?: 'localhost';
private $username = getenv('DB_USER') ?: 'root';
private $password = getenv('DB_PASS') ?: '';
private $database = getenv('DB_NAME') ?: 'clinic_db';
```

### 4. Enable HTTPS
Update CORS headers:
```php
header('Access-Control-Allow-Origin: https://yourdomain.com');
```

### 5. Rate Limiting
Implement rate limiting to prevent brute force attacks.

### 6. Session Management
Add JWT tokens or PHP sessions for authentication.

## Troubleshooting

### Connection Failed
- Check MySQL service is running
- Verify credentials in `Database.php`
- Check MySQL port (default: 3306)
- Ensure database exists

### CORS Errors
- Check `.htaccess` file exists
- Verify `Access-Control-Allow-Origin` header
- Enable mod_headers in Apache

### 404 Not Found
- Check file paths are correct
- Verify mod_rewrite is enabled
- Check file permissions

### Permission Denied
```bash
chmod 755 backend
chmod 755 backend/api
chmod 755 backend/config
```

## Support

For issues or questions:
1. Check error logs: `error_log` file or Apache logs
2. Test connection: Visit `test-connection.php`
3. Verify database schema matches
4. Check PHP version compatibility

<?php
/**
 * Database Connection Class (Public)
 * Singleton pattern for MySQL database connection
 */
class Database {
    private static $instance = null;
    private $connection;

    // Database configuration
    private $host = "localhost";
    private $username = "root";
    private $password = "";
    private $database = "clinic_db";
    private $port = 3306;

    /**
     * Private constructor to prevent direct instantiation
     */
    private function __construct() {
        $this->connect();
    }

    /**
     * Get singleton instance of Database
     * @return Database
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    /**
     * Establish database connection
     */
    private function connect() {
        try {
            $this->connection = new mysqli(
                $this->host,
                $this->username,
                $this->password,
                $this->database,
                $this->port
            );

            if ($this->connection->connect_error) {
                throw new Exception("Connection failed: " . $this->connection->connect_error);
            }

            $this->connection->set_charset("utf8mb4");
            error_log("Database connection established successfully");

        } catch (Exception $e) {
            error_log("Database connection error: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get the MySQL connection object
     * @return mysqli
     */
    public function getConnection() {
        return $this->connection;
    }

    /**
     * Check if connected to database
     * @return bool
     */
    public function isConnected() {
        return $this->connection && $this->connection->ping();
    }

    /**
     * Execute a prepared statement query
     * @param string $sql SQL query with placeholders
     * @param array $params Parameters to bind
     * @param string $types Parameter types (e.g., "ss" for two strings)
     * @return mysqli_result|bool
     */
    public function query($sql, $params = [], $types = "") {
        try {
            error_log("Executing SQL: " . $sql);
            error_log("Parameters: " . json_encode($params));

            $stmt = $this->connection->prepare($sql);

            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->connection->error);
            }

            // Bind parameters if provided
            if (!empty($params) && !empty($types)) {
                $stmt->bind_param($types, ...$params);
            }

            $stmt->execute();

            // Get result for SELECT queries
            if (stripos(trim($sql), 'SELECT') === 0) {
                $result = $stmt->get_result();
                $stmt->close();
                return $result;
            }

            // For INSERT, UPDATE, DELETE
            $affected_rows = $stmt->affected_rows;
            $insert_id = $stmt->insert_id;
            $stmt->close();

            return (object)[
                'affected_rows' => $affected_rows,
                'insert_id' => $insert_id
            ];

        } catch (Exception $e) {
            error_log("Query execution error: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Begin transaction
     */
    public function beginTransaction() {
        $this->connection->begin_transaction();
    }

    /**
     * Commit transaction
     */
    public function commit() {
        $this->connection->commit();
    }

    /**
     * Rollback transaction
     */
    public function rollback() {
        $this->connection->rollback();
    }

    /**
     * Escape string for security
     * @param string $string
     * @return string
     */
    public function escapeString($string) {
        return $this->connection->real_escape_string($string);
    }

    /**
     * Close database connection
     */
    public function disconnect() {
        if ($this->connection) {
            $this->connection->close();
            error_log("Database connection closed");
        }
    }

    /**
     * Prevent cloning of the instance
     */
    private function __clone() {}

    /**
     * Prevent unserializing of the instance
     */
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}
?>

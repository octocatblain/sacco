<?php
// Database connection updated to PostgreSQL using PDO with a mysqli-compatible wrapper

// Lightweight .env loader (no external deps). Reads key=value pairs.
// Loads only if .env exists in project root.
$envPath = __DIR__ . DIRECTORY_SEPARATOR . '.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#')
            continue;
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $key = trim($parts[0]);
            $val = trim($parts[1]);
            // Remove optional surrounding quotes
            if ((str_starts_with($val, '"') && str_ends_with($val, '"')) || (str_starts_with($val, "'") && str_ends_with($val, "'"))) {
                $val = substr($val, 1, -1);
            }
            putenv($key . '=' . $val);
        }
    }
}

// Fetch configuration (PostgreSQL defaults)
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_user = getenv('DB_USER') ?: 'postgres';
$db_pass = getenv('DB_PASS') ?: '';
$db_name = getenv('DB_NAME') ?: 'sacco';
$db_port = (int) (getenv('DB_PORT') ?: 5432);

// mysqli-compatible result wrapper backed by PDO
class CompatPDOResult
{
    public $num_rows = 0;
    private $rows = [];
    private $idx = 0;

    public function __construct(PDOStatement $stmt)
    {
        $this->rows = $stmt->fetchAll(PDO::FETCH_BOTH);
        $this->num_rows = count($this->rows);
    }

    public function fetch_assoc()
    {
        if ($this->idx >= $this->num_rows)
            return null;
        $row = $this->rows[$this->idx++];
        $assoc = [];
        foreach ($row as $k => $v) {
            if (!is_int($k))
                $assoc[$k] = $v;
        }
        return $assoc;
    }

    public function fetch_array()
    {
        if ($this->idx >= $this->num_rows)
            return null;
        return $this->rows[$this->idx++];
    }
}

// mysqli-compatible connection wrapper backed by PDO (PostgreSQL)
class CompatPDO
{
    private $pdo;
    public $insert_id = 0;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function query($sql)
    {
        $trim = ltrim($sql);
        // Normalize MySQL backtick identifiers to PostgreSQL double quotes
        $sql = str_replace('`', '"', $sql);
        // Transform MySQL's INSERT ... SET syntax to standard INSERT for Postgres
        if (preg_match('/^INSERT\s+INTO\s+([a-zA-Z0-9_"\.]+)\s+SET\s+(.+)$/is', $trim, $m)) {
            $table = $m[1];
            $assignments = $m[2];
            $pairs = $this->splitAssignments($assignments);
            $cols = [];
            $vals = [];
            foreach ($pairs as $p) {
                $parts = explode('=', $p, 2);
                if (count($parts) === 2) {
                    $col = trim($parts[0], " \t\n\r\0\x0B`\"");
                    $val = trim($parts[1]);
                    if ($col !== '') {
                        $cols[] = $this->quoteIdent($col);
                        $vals[] = $val;
                    }
                }
            }
            $cols_sql = implode(', ', $cols);
            $vals_sql = implode(', ', $vals);
            // Assume serial PK column named id; capture it for insert_id
            $sql2 = "INSERT INTO $table ($cols_sql) VALUES ($vals_sql) RETURNING id";
            $stmt = $this->pdo->query($sql2);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->insert_id = $row && isset($row['id']) ? (int) $row['id'] : 0;
            return true;
        }

        if (preg_match('/^SELECT\b/i', $trim)) {
            $stmt = $this->pdo->query($sql);
            return new CompatPDOResult($stmt);
        }

        // For UPDATE/DELETE/others, return boolean like mysqli::query
        $res = $this->pdo->exec($sql);
        return $res !== false;
    }

    public function prepare($sql)
    {
        return $this->pdo->prepare($sql);
    }

    public function real_escape_string($str)
    {
        // Return unquoted, escaped string similar to mysqli_real_escape_string
        $q = $this->pdo->quote($str);
        return substr($q, 1, -1);
    }

    public function close()
    {
        $this->pdo = null;
    }

    private function splitAssignments($s)
    {
        $out = [];
        $buf = '';
        $inSingle = false;
        $inDouble = false;
        $len = strlen($s);
        for ($i = 0; $i < $len; $i++) {
            $ch = $s[$i];
            if ($ch === "'" && !$inDouble) {
                $inSingle = !$inSingle;
                $buf .= $ch;
            } elseif ($ch === '"' && !$inSingle) {
                $inDouble = !$inDouble;
                $buf .= $ch;
            } elseif ($ch === ',' && !$inSingle && !$inDouble) {
                $out[] = trim($buf);
                $buf = '';
            } else {
                $buf .= $ch;
            }
        }
        if (trim($buf) !== '')
            $out[] = trim($buf);
        return $out;
    }

    private function quoteIdent($ident)
    {
        $ident = trim($ident, "`\" ");
        if (strpos($ident, '.') !== false) {
            $parts = explode('.', $ident);
            $parts = array_map(function ($p) {
                return '"' . str_replace('"', '""', $p) . '"';
            }, $parts);
            return implode('.', $parts);
        }
        return '"' . str_replace('"', '""', $ident) . '"';
    }
}

// Create PDO connection for PostgreSQL and expose as $conn through the compat wrapper
try {
    $dsn = "pgsql:host=$db_host;port=$db_port;dbname=$db_name";
    $pdo = new PDO($dsn, $db_user, $db_pass);
    $conn = new CompatPDO($pdo);
} catch (PDOException $e) {
    die('Could not connect to PostgreSQL: ' . $e->getMessage());
}

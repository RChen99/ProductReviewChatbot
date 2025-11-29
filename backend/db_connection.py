import os
from typing import Optional

import mysql.connector
from mysql.connector import MySQLConnection, Error


def get_db_connection(
    host: Optional[str] = None,
    port: Optional[int] = None,
    user: Optional[str] = None,
    password: Optional[str] = None,
    database: Optional[str] = None,
) -> MySQLConnection:
    """
    Create and return a MySQL database connection.

    By default this reads connection settings from environment variables:
      - DB_HOST (default: 'localhost')
      - DB_PORT (default: 3306)
      - DB_USER (default: 'root')
      - DB_PASSWORD (no default; must be set)
      - DB_NAME (no default; must be set)

    You can also override any of these by passing arguments directly.
    """

    conn_config = {
        "host": host or os.getenv("DB_HOST", "localhost"),
        "port": int(port or os.getenv("DB_PORT", 3306)),
        "user": user or os.getenv("DB_USER", "root"),
        "password": password or os.getenv("DB_PASSWORD", ""),
        "database": database or os.getenv("DB_NAME", ""),
    }

    try:
        connection = mysql.connector.connect(**conn_config)
        # Optional: ensure we actually connected
        if not connection.is_connected():
            raise Error("Failed to establish MySQL connection")
        return connection
    except Error as exc:
        # Re-raise with a clearer message; caller can handle/log as needed
        raise RuntimeError(f"Error connecting to MySQL: {exc}") from exc


if __name__ == "__main__":
    """
    Simple manual test:
      1. Set your env vars, e.g.:
         export DB_HOST=localhost
         export DB_PORT=3306
         export DB_USER=root
         export DB_PASSWORD=your_password_here
         export DB_NAME=your_database_name
      2. Run: python db_connection.py
    """
    try:
        conn = get_db_connection()
        print("Successfully connected to MySQL.")
        conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")



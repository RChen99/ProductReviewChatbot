import os
from typing import Optional

import mysql.connector
from mysql.connector import MySQLConnection, Error

from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

def get_db_connection(
    host: Optional[str] = None,
    port: Optional[int] = None,
    user: Optional[str] = None,
    password: Optional[str] = None,
    database: Optional[str] = None,
) -> MySQLConnection:

    conn_config = {
        "host": host or os.getenv("DB_HOST", "localhost"),
        "port": int(port or os.getenv("DB_PORT", 3306)),
        "user": user or os.getenv("DB_USER", "root"),
        "password": password or os.getenv("DB_PASSWORD", ""),
        "database": database or os.getenv("DB_NAME", ""),
    }

    try:
        connection = mysql.connector.connect(**conn_config)
        # Ensure we actually connected
        if not connection.is_connected():
            raise Error("Failed to establish MySQL connection")
        return connection
    except Error as exc:
       # Raise connection error
        raise RuntimeError(f"Error connecting to MySQL: {exc}") from exc


if __name__ == "__main__":

    try:
        conn = get_db_connection()
        print("Successfully connected to MySQL.")
        conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")



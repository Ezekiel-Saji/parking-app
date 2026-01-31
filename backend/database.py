import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "parking.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS parking_zones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            total_slots INTEGER NOT NULL,
            price REAL NOT NULL,
            is_live BOOLEAN DEFAULT 0
        )
    """)
    
    # Always refresh live mock zones to ensure they are correct and scattered
    cursor.execute("DELETE FROM parking_zones WHERE is_live = 1")
    
    # Use fixed IDs for mock zones to match frontend INITIAL_OFFSETS
    mock_zones = [
        (1, "Zone 1 - City Center Garage", 0.015, 0.015, 50, 5),
        (2, "Zone 2 - Parking Lot", -0.045, -0.045, 30, 8),
        (3, "Tech Park Zone A", 0.090, 0.020, 100, 4),
        (4, "Riverside Walk", -0.020, 0.095, 20, 6),
        (5, "Central Hospital P1", 0.100, -0.030, 40, 3),
        (6, "Retail Hub Parking", -0.090, -0.050, 60, 7),
        (7, "Green Plaza", 0.050, -0.090, 25, 4),
        (8, "Station Side", -0.100, 0.040, 15, 9)
    ]
    
    for zid, name, lat, lng, total, price in mock_zones:
        cursor.execute("INSERT INTO parking_zones (id, name, lat, lng, total_slots, price, is_live) VALUES (?, ?, ?, ?, ?, ?, 1)",
                       (zid, name, lat, lng, total, price))
    
    conn.commit()
    conn.close()

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_all_zones():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM parking_zones")
    zones = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return zones

def add_zone(name, lat, lng, total_slots, price):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO parking_zones (name, lat, lng, total_slots, price) VALUES (?, ?, ?, ?, ?)",
                   (name, lat, lng, total_slots, price))
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return new_id

def delete_zone(zone_id):
    conn = get_db()
    cursor = conn.cursor()
    # Don't delete live zones if id 1 or 2
    cursor.execute("DELETE FROM parking_zones WHERE id = ? AND is_live = 0", (zone_id,))
    conn.commit()
    conn.close()

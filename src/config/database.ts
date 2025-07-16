import sqlite3 from "sqlite3";
sqlite3.verbose();

const db = new sqlite3.Database("./mydb.sqlite", (err) => {
  if (err) console.error(err);
  else console.log("Connected to SQLite");
});

// khởi tạo bảng users
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    refreshToken TEXT
  )
`);

// khởi tạo bảng devices
db.run(`
  CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    ip_address TEXT UNIQUE NOT NULL,
    manager_user_id INTEGER,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (manager_user_id) REFERENCES users(id)
  )
`);

// khởi tạo bảng ping_logs
db.run(`
  CREATE TABLE IF NOT EXISTS ping_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id INTEGER,
    status INTEGET NOT NULL,
    ping_time DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (device_id) REFERENCES devices(id)
  )
`);

export default db;

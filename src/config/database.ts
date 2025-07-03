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
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    refreshToken TEXT
  )
`);

export default db;

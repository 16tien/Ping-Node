const db = require('../config/database');

const initDB = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS IpAddresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error("❌ Lỗi khi tạo bảng IpAddresses:", err);
      } else {
        console.log("✅ Bảng IpAddresses đã sẵn sàng");
      }
    });
  });
};

module.exports = initDB;

import sqlite3 from "sqlite3";
sqlite3.verbose();

const db = new sqlite3.Database("./mydb.sqlite");

// interface để type-safe
export interface DeviceData {
  id?: number;
  name: string | null;
  ip_address: string;
  manager_user_id?: number | null;
  created_at?: string;
}

class Device {
  static create(data: DeviceData): Promise<{ id: number }> {
    return new Promise((resolve, reject) => {
      const stmt = `
        INSERT INTO devices (name, ip_address, manager_user_id)
        VALUES (?, ?, ?)
      `;
      db.run(
        stmt,
        [data.name, data.ip_address, data.manager_user_id ?? null],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  }

  static findById(id: number): Promise<DeviceData | undefined> {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM devices WHERE id = ?`, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row as DeviceData | undefined);
      });
    });
  }

  static findAll(): Promise<DeviceData[]> {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM devices`, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows as DeviceData[]);
      });
    });
  }

  static delete(id: number): Promise<{ changes: number }> {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM devices WHERE id = ?`, [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  }

  static update(id: number, data: DeviceData): Promise<{ changes: number }> {
    return new Promise((resolve, reject) => {
      db.run(
        `
        UPDATE devices
        SET name = ?, ip_address = ?, manager_user_id = ?
        WHERE id = ?
      `,
        [data.name, data.ip_address, data.manager_user_id ?? null, id],
        function (err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }
}

export default Device;

import db from '../config/database';
import { DeviceData } from '../data/DeviceData';



class DeviceModel {
  static queryDevices = (
    whereClause: string,
    params: any[],
    limit: number,
    offset: number,
    orderBy: string,
    order: string
  ): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const sql = `
      SELECT 
        d.id,d.address, d.name, d.ip_address, 
        u.id AS manager_id, u.name AS manager_name,
        pl.status, pl.ping_time
      FROM devices d
      LEFT JOIN users u ON d.manager_user_id = u.id
      LEFT JOIN (
        SELECT device_id, status, ping_time
        FROM ping_logs
        WHERE (device_id, ping_time) IN (
          SELECT device_id, MAX(ping_time)
          FROM ping_logs
          GROUP BY device_id
        )
      ) pl ON d.id = pl.device_id
      ${whereClause}
      ORDER BY d.${orderBy} ${order}
      LIMIT ? OFFSET ?
    `;
      db.all(sql, [...params, limit, offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

  static countDevices = (
    whereClause: string,
    params: any[]
  ): Promise<number> => {
    return new Promise((resolve, reject) => {
      const sql = `
      SELECT COUNT(*) as total
      FROM devices d
      LEFT JOIN users u ON d.manager_user_id = u.id
      LEFT JOIN (
        SELECT device_id, status, ping_time
        FROM ping_logs
        WHERE (device_id, ping_time) IN (
          SELECT device_id, MAX(ping_time)
          FROM ping_logs
          GROUP BY device_id
        )
      ) pl ON d.id = pl.device_id
      ${whereClause}
    `;

      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve((row as { total: number })?.total || 0);
      });
    });
  };

  static findAllIdAndIP(): Promise<Array<{ id: number; ip_address: string }>> {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, ip_address FROM devices`;
      db.all(query, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows as Array<{ id: number; ip_address: string }>);
      });
    });
  }

  static findById(id: number): Promise<DeviceData | null> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM devices WHERE id = ?`;
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row) {
            resolve(row as DeviceData); 
          } else {
            resolve(null);
          }
        }
      });
    });
  }
  static deleteById(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM devices WHERE id = ?`;
    db.run(query, [id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
static create(data: {
  name: string;
  ip_address: string;
  address: string;
  manager_user_id: number;
}): Promise<DeviceData> {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO devices (name, ip_address, address, manager_user_id, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `;
    const params = [data.name, data.ip_address, data.address, data.manager_user_id];

    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        const insertedId = this.lastID;
        db.get(`SELECT * FROM devices WHERE id = ?`, [insertedId], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row as DeviceData);
          }
        });
      }
    });
  });
}
static updateById(id: number, data: {
  name?: string;
  ip_address?: string;
  address?: string;
  manager_user_id?: number;
}): Promise<DeviceData> {
  return new Promise((resolve, reject) => {
    const fields: string[] = [];
    const params: any[] = [];

    if (data.name !== undefined) {
      fields.push("name = ?");
      params.push(data.name);
    }

    if (data.ip_address !== undefined) {
      fields.push("ip_address = ?");
      params.push(data.ip_address);
    }

    if (data.address !== undefined) {
      fields.push("address = ?");
      params.push(data.address);
    }

    if (data.manager_user_id !== undefined) {
      fields.push("manager_user_id = ?");
      params.push(data.manager_user_id);
    }

    if (fields.length === 0) {
      return reject(new Error("Không có trường nào được cập nhật."));
    }

    params.push(id); // id là tham số cuối

    const query = `
      UPDATE devices
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        db.get(`SELECT * FROM devices WHERE id = ?`, [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row as DeviceData);
          }
        });
      }
    });
  });
}
}

export default DeviceModel;

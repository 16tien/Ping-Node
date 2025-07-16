import { resolve } from 'path';
import db from '../config/database';
import { rejects } from 'assert';

export interface PingLogData {
    id?: number;
    device_id: number;
    status: number ;
    ping_time: string;
}
class PingLog {
  static create(device_id: number, status: number): Promise<{ id: number }> {
    return new Promise((resolve, reject) => {
      const stmt = `
        INSERT INTO ping_logs (device_id, status)
        VALUES (?, ?)
      `;
      db.run(
        stmt,
        [device_id, status],
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
  static isOfflineLast3Pings(device_id: number): Promise<Boolean>{
   return new Promise((resolve, reject) => {
      const sql = `
        SELECT COUNT(*) = 3 AS is_all_false
        FROM (
          SELECT status
          FROM ping_logs
          WHERE device_id = ?
          ORDER BY ping_time DESC
          LIMIT 3
        ) AS last_3
        WHERE status = 0
      `;

      db.get(sql, [device_id], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(false);
        resolve(!!(row as { is_all_false: number }).is_all_false);
      });
    });
  }
}

export default PingLog
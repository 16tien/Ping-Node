import db from '../config/database';
import { PingLogData } from '../data/PingLogData';

class PingLog {
  static getDeviceByIdService(deviceId: number) {
    throw new Error('Method not implemented.');
  }
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

  static isOfflineLast3Pings(device_id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sql = `
      SELECT status
      FROM ping_logs
      WHERE device_id = ?
      ORDER BY ping_time DESC
      LIMIT 4
    `;

      db.all(sql, [device_id], (err, rows) => {
        if (err) return reject(err);
        if (!rows || rows.length < 3) return resolve(false);

        const logs = rows as { status: number }[];

        const first3Offline = logs[0].status === 0 && logs[1].status === 0 && logs[2].status === 0;

        if (!first3Offline) {
          return resolve(false);
        }

        if (logs.length === 3) {
          return resolve(true);
        }

        const fourthStatus = logs[3].status;
        return resolve(fourthStatus === 1);
      });
    });
  }



  static countPingLogs(
    device_id: number,
    from?: string,
    to?: string,
    status?: number
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      let sql = `
      SELECT COUNT(*) as total
      FROM ping_logs
      WHERE device_id = ?
    `;
      const params: any[] = [device_id];

      if (from && to) {
        sql += " AND ping_time BETWEEN ? AND ?";
        params.push(from, to);
      }

      if (status !== undefined) {
        sql += " AND status = ?";
        params.push(status);
      }

      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        const total = (row as { total: number })?.total ?? 0;
        resolve(total);
      });
    });
  }


  static fetchPingLogsData(
    device_id: number,
    page: number,
    limit: number,
    from?: string,
    to?: string,
    status?: number
  ): Promise<PingLogData[]> {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;

      let sql = `
      SELECT *
      FROM ping_logs
      WHERE device_id = ?
    `;
      const params: any[] = [device_id];

      if (from && to) {
        sql += " AND ping_time BETWEEN ? AND ?";
        params.push(from, to);
      }

      if (status !== undefined) {
        sql += " AND status = ?";
        params.push(status);
      }

      sql += " ORDER BY ping_time DESC LIMIT ? OFFSET ?";
      params.push(limit, offset);

      db.all(sql, params, (err, rows: PingLogData[]) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  static findLastByDeviceId(deviceId: number) {
    return new Promise<any>((resolve, reject) => {
      db.get(
        `SELECT * FROM ping_logs WHERE device_id = ? ORDER BY id DESC LIMIT 1`,
        [deviceId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }


}

export default PingLog
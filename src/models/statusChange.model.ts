import db from '../config/database';

class StatusChange {
  static create({ device_id, old_status, new_status }: { device_id: number, old_status: number, new_status: number }) {
    return new Promise<void>((resolve, reject) => {
      db.run(
        `INSERT INTO status_changes (device_id, old_status, new_status) VALUES (?, ?, ?)`,
        [device_id, old_status, new_status],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
}

export default StatusChange;

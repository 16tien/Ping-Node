import db from '../config/database';

export interface UserType {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  refreshToken: string;
}

class UserModel {
  static createUser(
    name: string,
    email: string,
    password: string,
    role: string = "user",
    refreshToken: string = ""
  ): Promise<UserType> {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [name, email, password, role],
        function (err) {
          if (err) return reject(err);
          resolve({
            id: this.lastID,
            name,
            email,
            password,
            role,
            refreshToken,
          });
        }
      );
    });
  }

  static findByEmail(email: string): Promise<UserType | null> {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) return reject(err);
        resolve(row ? (row as UserType) : null);
      });
    });
  }

  static findById(id: number): Promise<UserType | null> {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row ? (row as UserType) : null);
      });
    });
  }

  static getUserByRefreshToken(refreshToken: string): Promise<UserType | null> {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE refreshToken = ?`, [refreshToken], (err, row) => {
        if (err) return reject(err);
        resolve(row ? (row as UserType) : null);
      });
    });
  }

  static saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET refreshToken = ? WHERE id = ?`,
        [refreshToken, userId],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  static deleteRefreshToken(userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET refreshToken = NULL WHERE id = ?`,
        [userId],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  } 
}

export default UserModel;

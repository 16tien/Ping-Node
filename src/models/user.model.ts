import db from '../config/database';

export interface UserType {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}
const createUser = (
  name: string,
  email: string,
  password: string,
  role: string = "user"
): Promise<UserType> => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      [name, email, password, role],
      function (err) {
        if (err) reject(err);
        else {
          resolve({
            id: this.lastID,
            name,
            email,
            password,
            role,
          });
        }
      }
    );
  });
};
const findByEmail = (email: string): Promise<UserType | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM users WHERE email = ?`,
      [email],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(row as UserType);
        }
      }
    );
  });
};

const saveRefreshToken = (userId: number, refreshToken: string) => {
  return new Promise<void>((resolve, reject) => {
    db.run(
      `UPDATE users SET refreshToken = ? WHERE id = ?`,
      [refreshToken, userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

const getUserByRefreshToken = (refreshToken: string): Promise<UserType | null> => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE refreshToken = ?`, [refreshToken], (err, row) => {
      if (err) reject(err);
      else if (!row) resolve(null);
      else resolve(row as UserType);
    });
  });
};
export default {
  createUser,
  findByEmail,
  saveRefreshToken,
  getUserByRefreshToken
};

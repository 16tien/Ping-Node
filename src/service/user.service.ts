import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { UserType } from '../types/user.type';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { Request, Response } from "express";

const saltRounds = 10;
const registerUserService = async (
  name: string,
  email: string,
  password: string
): Promise<UserType> => {
  const hashed = await bcrypt.hash(password, saltRounds);
  const user = await User.createUser(name, email, hashed, "user");
  return user;
};

const loginService = async (email: string, password: string) => {
  const user = await User.findByEmail(email);
  if (!user) {
    throw new Error("E1 Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("E2 Invalid email or password");
  }

  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });

  await User.saveRefreshToken(user.id, refreshToken);

  return {
    message: "Login successful",
    accessToken,
    refreshToken
  };
};


const refreshTokenService = async (refreshToken: string): Promise<string> => {
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken) as { id: number };
  } catch (err) {
    throw new Error("Invalid refresh token signature");
  }

  const user = await User.getUserByRefreshToken(refreshToken);

  if (!user) {
    throw new Error("Refresh token not found or revoked");
  }

  const newAccessToken = signAccessToken({
    id: user.id,
    role: user.role,
  });

  return newAccessToken;
};

export default {
  registerUserService,
  loginService,
  refreshTokenService
}
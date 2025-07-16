import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { UserType } from '../types/user.type';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";

const saltRounds = 10;
export interface LoginResult {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

const registerUserService = async (
  name: string,
  email: string,
  password: string
): Promise<UserType> => {
  const hashed = await bcrypt.hash(password, saltRounds);
  const user = await User.createUser(name, email, hashed, "user");
  return user;
};

const loginService = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  const user = await User.findByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Invalid email or password");
  }

  const payload = { id: user.id, role: user.role };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ id: user.id });

  await User.saveRefreshToken(user.id, refreshToken);

  return {
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

async function refreshTokenService(refreshToken: string): Promise<string> {
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken) as { id: number; };
  } catch (err) {
    throw new Error("Invalid refresh token signature");
  }

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("Refresh token mismatch or revoked");
  }

  const newAccessToken = signAccessToken({
    id: user.id,
    role: user.role,
  });

  return newAccessToken;
}

const deleteRefreshToken = async (refreshToken: string): Promise<void> => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken) as { id: number; };

  } catch (err) {
    throw new Error("Invalid refresh token signature");
  }
  const userId = decoded.id
  await User.deleteRefreshToken(userId);

}


export default {
  registerUserService,
  loginService,
  refreshTokenService,
  deleteRefreshToken
}
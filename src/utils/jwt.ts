import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_SECRET: Secret = process.env.ACCESS_SECRET || "access_default";
const REFRESH_SECRET: Secret = process.env.REFRESH_SECRET || "refresh_default";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export const signAccessToken = (payload: object): string => {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN
  });
};

export const signRefreshToken = (payload: object): string => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};

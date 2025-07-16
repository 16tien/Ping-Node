import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET!;

export interface AuthRequest extends Request {
  user?: any;
}

interface JwtPayload {
  userId: string;
  role?: string;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
  res.status(403).json({ message: "No access token provided" });
  return;
}

try {
  const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload;
  req.user = decoded;
  next();
} catch (err) {
  res.status(401).json({ message: "Invalid or expired access token" });
  return;
}
};


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
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

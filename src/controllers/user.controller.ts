import { Request, Response } from 'express';
import userService from '../service/user.service';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
};


const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body
    const user = await userService.registerUserService(name, email, password)
    res.status(201).json(user)
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error in createUser:`, err);
    res.status(500).json({ message: "Server error" });
  }
}


export { createUser };
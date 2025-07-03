import { Request, Response } from 'express';
import userService from '../service/user.service';


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

const handleLogin = async (req: Request, res: Response): Promise<void> => {
 try {
    const { email, password } = req.body;
    const result = await userService.loginService(email, password);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const newAccessToken = await userService.refreshTokenService(refreshToken);
    res.status(200).json({
      message: "New access token issued",
      accessToken: newAccessToken,
    });
  } catch (err: any) {
    console.error(`[${new Date().toISOString()}] Error in refresh:`, err.message);
    if (err.message.includes("Missing refresh token")) {
      res.status(400).json({ message: err.message });
    } else if (
      err.message.includes("Invalid refresh token") ||
      err.message.includes("not found")
    ) {
      res.status(403).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

export { createUser, handleLogin, refresh };
import { Request, Response } from 'express';
import userService from '../service/user.service';
import { COOKIE_OPTIONS, ACCESS_TOKEN_COOKIE_OPTIONS } from '../utils/cookieOptions';

const handleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, message, user } = await userService.loginService(email, password);

    res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    res.status(200).json({ message, user });
    console.log(`User ${email} logged in`);
  } catch (err: any) {
    console.error("Login error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new Error("Missing refresh token");

    const newAccessToken = await userService.refreshTokenService(refreshToken);

    res
      .cookie("accessToken", newAccessToken, ACCESS_TOKEN_COOKIE_OPTIONS)
      .status(200)
      .json({ message: "New access token issued" });

    console.log("Refresh token used");
  } catch (err: any) {
    console.error(`[${new Date().toISOString()}] Error in refresh:`, err.message);

    if (err.message.includes("Missing refresh token")) {
      res.clearCookie("accessToken");
      res.status(400).json({ message: err.message });
    } else if (err.message.includes("Invalid refresh token") || err.message.includes("not found")) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(403).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

const checkAuth = async (req: Request, res: Response) => {
  res.json({
    message: "Authenticated",
  });
};

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await userService.deleteRefreshToken(refreshToken)
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error during logout" });
  }
};

export { handleLogin, refresh, checkAuth, logout };

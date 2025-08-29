// controllers/dashboard.controller.ts
import { Request, Response } from "express";
import dashboardService from "../service/dashboard.service";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const data = await dashboardService.getDashboardData();
    res.json(data);
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { getDashboardData } from "../controllers/dashboard.controller";

const router = express.Router();

router.get("/", verifyToken, getDashboardData);

export default router;

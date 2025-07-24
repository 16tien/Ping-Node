import express from 'express'

import {handleLogin } from "../controllers/auth.controller"
import {refresh } from "../controllers/auth.controller"
import { verifyToken } from '../middleware/verifyToken'
import {checkAuth } from "../controllers/auth.controller"
import {logout } from "../controllers/auth.controller"

const router = express.Router()

router.get("/auth/me", verifyToken, checkAuth)
router.post('/login', handleLogin)
router.post("/refresh-token", refresh);
router.post("/logout", logout)
export default router

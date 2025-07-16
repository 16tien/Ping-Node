import express from 'express'

import {handleLogin } from "../controllers/auth.controller"
import {refresh } from "../controllers/auth.controller"
import { verifyToken } from '../middleware/verifyToken'
import {checkAuth } from "../controllers/auth.controller"
import {logout } from "../controllers/auth.controller"

const router = express.Router()

router.post('/login', handleLogin)
router.post("/refresh-token", refresh);
router.get("/auth/me", verifyToken, checkAuth)
router.post("/logout", logout)
export default router

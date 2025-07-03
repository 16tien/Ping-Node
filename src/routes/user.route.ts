import express from 'express'
import { createUser } from '../controllers/user.controller'
import {handleLogin } from "../controllers/user.controller"
import {refresh } from "../controllers/user.controller"

const router = express.Router()

router.post('/register', createUser)
router.post('/login', handleLogin)
router.post("/refresh-token", refresh);


export default router

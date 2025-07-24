import express from 'express'
import { verifyToken } from '../middleware/verifyToken'
import {getPingLogByDeviceId} from '../controllers/ping.controller'
const router = express.Router()
router.get('/pingLogById', verifyToken, getPingLogByDeviceId)

export default router

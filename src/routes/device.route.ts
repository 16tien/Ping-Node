import express from 'express'
import { authorizeRole, verifyToken } from '../middleware/verifyToken'
import { allInfoDevices, getDeviceById, deleteDeviceById,createDeviceController,updateDeviceController } from '../controllers/device.controller'

const router = express.Router()

router.get('/allInfoDevices', verifyToken, allInfoDevices);
router.delete('/delete/:id', verifyToken, authorizeRole('admin'), deleteDeviceById);
router.post('/addDevice', verifyToken, authorizeRole('admin'), createDeviceController)
router.put('/updateDevice/:id',verifyToken, authorizeRole('admin'), updateDeviceController);
router.get('/:id', verifyToken, getDeviceById);

export default router

import express from 'express'
import { createUser,getUserById,getAllNameUser, getAllUsers } from '../controllers/user.controller'
import { authorizeRole, verifyToken } from '../middleware/verifyToken'

const router = express.Router()

router.post('/addUser',verifyToken,authorizeRole('admin'), createUser)
router.get('/username', verifyToken, authorizeRole('admin'), getAllNameUser)
router.get('/',verifyToken, authorizeRole('admin'), getAllUsers);
router.get('/:id', verifyToken, getUserById)

export default router

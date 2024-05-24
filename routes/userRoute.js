import express from 'express'
import {registerUser,authUser,editUser,updatePassword,getUserByPhone,getUser,logout
} from '../controller/userController.js'
import { protect, protectRefreshToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/').post(registerUser).get(protect, getUser)
router.route('/login').post(authUser)
router.route('/editUser').post(protect, editUser)
router.route('/resetPassword').post(protect, updatePassword);
router.route('/getUserByPhone').post(protect, getUserByPhone)
router.route('/refresh').get(protectRefreshToken);
router.route('/logout').get(logout);



export default router
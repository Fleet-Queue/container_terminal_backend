import express from "express";
import {
    registerBooking, 
    getDoById,
    getAllBooking
} from "../controller/doBookingController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect,registerBooking);
router.route("/getDoById").post(protect, getDoById);
router.route("/getAllDO").post(protect, getAllBooking);

export default router;

import express from "express";
import {
    registerBooking, 
    getDoById,
    getAllBooking,
    deleteDo,
    uploadDeliveryOrder,
    getAllDeliveryOrder
} from "../controller/doBookingController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";
import { errorHandler } from "../middlewares/errorMiddleware.js";

const router = express.Router();

router.route("/").post(protect,registerBooking).delete(protect, deleteDo);
router.route("/uploadDO").post(protect,uploadDeliveryOrder)
router.route("/getDoById").post(protect, getDoById);
router.route("/getAllDO").post(protect, getAllBooking);
router.route("/getAllDeliveryOrders").post(protect, getAllDeliveryOrder);
router.use(errorHandler);
export default router;

import express from "express";
import {
    registerBooking, 
    getDoById,
    getAllBooking,
    deleteDo,
    uploadDeliveryOrder,
    updateDeliveryOrder,
    getAllDeliveryOrder,
    deleteDeliveryOrder,
    CancelDeliveryOrder,
    CancelDoBooking,
    ReOpenDoBooking
} from "../controller/doBookingController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";
import { errorHandler } from "../middlewares/errorMiddleware.js";

const router = express.Router();

router.route("/").post(protect,registerBooking).delete(protect, deleteDo);
router.route("/uploadDO").post(protect,uploadDeliveryOrder)
router.route("/updateDO/:id").put(protect, updateDeliveryOrder);
router.route("/cancelDO/:id").post(protect, CancelDeliveryOrder);
router.route("/cancelDOBooking/:id").post(protect, CancelDoBooking);
router.route("/reopen-do-booking/:id").post(protect, ReOpenDoBooking);
router.route("/getDoById").post(protect, getDoById);
router.route("/getAllDO").post(protect, getAllBooking);
router.route("/getAllDeliveryOrders").post(protect, getAllDeliveryOrder);
router.route("/deleteDeliveryOrder/:id").delete(protect,deleteDeliveryOrder )
router.use(errorHandler);
export default router;

import express from "express";
import {
 registerTruck,
 getTruckByNumber,
 getTruckById,
 getAllTruck, 
 updateStatus,
 deleteTruck,
 addTruckToBooking,
 updateTruckBookingStatus,
 getAllInqueTrucks,
 getAllTruckBookings
} from "../controller/truckController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";
import { errorHandler } from "../middlewares/errorMiddleware.js"; // Assuming you have an error handling middleware

const router = express.Router();

router.route("/").post(protect,registerTruck); //need to protect
router.route("/getTruckByNumber").post(protect, getTruckByNumber);
router.route("/getTruckById").post(protect, getTruckById);
router.route("/getAllTruck").post(protect, getAllTruck);
router.route("/updateTruckStatus").post(protect, updateStatus);
router.route("/addTruckToBooking").post(protect, addTruckToBooking);
router.route("/updateTruckBookingStatus").post(protect, updateTruckBookingStatus);
router.route("/getInQueueTrucks").post(protect, getAllInqueTrucks);
// router.route("/getAllTruckBookig").post(protect, getAllInqueTrucks);
router.route("/getAllTruckBookings").post(protect, getAllTruckBookings);
router.route("/deleteTruck").post(protect, deleteTruck);
// Error handling middleware
router.use(errorHandler);
export default router;

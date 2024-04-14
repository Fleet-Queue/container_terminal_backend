import express from "express";
import {
 registerTruck,
 getTruckByNumber,
 getAllTruck, 
 updateStatus,
 deleteTruck
} from "../controller/truckController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerTruck);
router.route("/getDriverByNumber").post(protect, getTruckByNumber);
router.route("/getAllTruck").post(protect, getAllTruck);
router.route("/updateTruckStatus").post(protect, updateStatus);
router.route("/deleteTruck").post(protect, deleteTruck);
export default router;

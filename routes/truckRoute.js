import express from "express";
import {
 registerTruck,
 getTruckByNumber,
 getTruckById,
 getAllTruck, 
 updateStatus,
 deleteTruck
} from "../controller/truckController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerTruck);
router.route("/getTruckByNumber").post(protect, getTruckByNumber);
router.route("/getTruckById").post(protect, getTruckById);
router.route("/getAllTruck").post(protect, getAllTruck);
router.route("/updateTruckStatus").post(protect, updateStatus);
router.route("/deleteTruck").post(protect, deleteTruck);
export default router;

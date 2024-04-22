import express from "express";
import {
    registerRate, getRateByLocation,getAllRatesBasedOnLocation 
} from "../controller/rateMappingController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect,registerRate);
router.route("/getRateByLocation").post(protect, getRateByLocation);
router.route("/getAllRatesBasedOnLocation").post(protect, getAllRatesBasedOnLocation);

export default router;

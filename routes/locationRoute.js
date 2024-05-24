import express from "express";
import {
 registerLocation,
 getLocationByName,
 getAllLocation
} from "../controller/locationController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";
import { errorHandler } from "../middlewares/errorMiddleware.js"; // Assuming you have an error handling middleware

const router = express.Router();

router.route("/").post(protect,registerLocation);
router.route("/getLocationByname").post(protect, getLocationByName);
router.route("/getAllLocation").post(protect, getAllLocation);
router.use(errorHandler);
export default router;

import express from "express";
import {
 registerLocation,
 getLocationByName
} from "../controller/locationController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerLocation);
router.route("/getDriverByName").post(protect, getLocationByName);

export default router;

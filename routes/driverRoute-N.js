import express from "express";
import {
 registerLocation,
 getLocationByName,
 getAllLocation
} from "../controller/locationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect,registerLocation);
router.route("/getLocationByname").post(protect, getLocationByName);
router.route("/getAllLocation").post(protect, getAllLocation);

export default router;

import express from "express";
import {
  registerDriver,
  getDriverByName,
  getDriverByPhone,
  getCompanyDrivers
} from "../controller/driverController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, registerDriver);
router.route("/getDriverByName").post(protect, getDriverByName);
router.route("/getDriverByPhone").post(protect, getDriverByPhone);
 router.route("/getCompanyDrivers").get(protect, getCompanyDrivers);

export default router;

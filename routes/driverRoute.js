import express from "express";
import {
  registerDriver,
  getDriverByName,
  getDriverByPhone,
} from "../controller/driverController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerDriver);
router.route("/getDriverByName").post(protect, getDriverByName);
router.route("/getDriverByPhone").post(protect, getDriverByPhone);

export default router;

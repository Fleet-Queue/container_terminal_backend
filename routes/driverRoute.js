import express from "express";
import {
  registerDriver,
  getDriverByName,
  getDriverByPhone,
  getCompanyDrivers,
  getAllDrivers,
  deleteDriver,
  updateDriver,
} from "../controller/driverController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";
import { errorHandler } from "../middlewares/errorMiddleware.js";

const router = express.Router();

router.route("/").post(protect, registerDriver);
router.route("/:id").delete(deleteDriver)
router.route("/:id").patch(updateDriver)
router.route("/getDriverByName").post(protect, getDriverByName);
router.route("/getAllDrivers").post(protect, getAllDrivers);

router.route("/getDriverByPhone").post(protect, getDriverByPhone);
 router.route("/getCompanyDrivers").post(protect, getCompanyDrivers);
 router.use(errorHandler);
export default router;

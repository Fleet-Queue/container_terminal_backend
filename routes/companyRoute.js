import express from "express";
import {
  registerCompany,
  getCompany,
  getAllCompany
} from "../controller/companyController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { errorHandler } from "../middlewares/errorMiddleware.js";

const router = express.Router();

router.route("/").post(registerCompany);
router.route("/getCompany").post(protect, getCompany);
router.route("/getAllCompany").post(protect, getAllCompany);

router.use(errorHandler);
export default router;

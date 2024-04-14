import express from "express";
import {
  registerCompany,
  getCompany
} from "../controller/companyController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerCompany);
router.route("/getCompany").post(protect, getCompany);


export default router;

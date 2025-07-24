import express from "express";
import {
 getFleet
} from "../controller/fleetController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { errorHandler } from "../middlewares/errorMiddleware.js";

const router = express.Router();

router.route("/").post(protect,getFleet);

// Error handling middleware
router.use(errorHandler);
export default router;

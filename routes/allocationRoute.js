import express from "express";
import {
    doAllocation,
    getAllocationDetails
} from "../controller/allocationController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";
import { errorHandler } from "../middlewares/errorMiddleware.js";

const router = express.Router();

router.route("/").post(doAllocation);
router.route("/getAllocationDetails").post(getAllocationDetails);
router.use(errorHandler);
export default router;

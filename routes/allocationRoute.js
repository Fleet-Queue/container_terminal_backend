import express from "express";
import {
    doAllocation,
    getAllocationDetails,
    changeAllocationStatus
} from "../controller/allocationController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";
import { errorHandler } from "../middlewares/errorMiddleware.js";

const router = express.Router();

router.route("/").post(protect,doAllocation);
router.route("/getAllocationDetails").post(protect,getAllocationDetails);
router.route("/changeAllocationStatus").post(protect,changeAllocationStatus);
router.use(errorHandler);
export default router;

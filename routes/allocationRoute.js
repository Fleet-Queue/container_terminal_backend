import express from "express";
import {
    doAllocation,
    getAllocationDetails,
    changeAllocationStatus,
    CancelAllocatedBooking,
    ReAllocateBooking,
    getAllAllocationDetails
} from "../controller/allocationController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";
import { errorHandler } from "../middlewares/errorMiddleware.js";

const router = express.Router();

router.route("/").post(protect,doAllocation);
router.route("/getAllocationDetails").post(protect,getAllocationDetails);
router.route("/get-All-AllocationDetails").post(protect,getAllAllocationDetails);
router.route("/changeAllocationStatus").post(protect,changeAllocationStatus);
router.route("/cancel-allocated-booking/:id").post(protect, CancelAllocatedBooking);
router.route("/re-allocate-booking/:id").post(protect, ReAllocateBooking);
router.use(errorHandler);
export default router;

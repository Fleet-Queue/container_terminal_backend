import express from "express";
import {
    doAllocation,
    getAllocationDetails
} from "../controller/allocationController.js";
import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(doAllocation);
router.route("/getAllocationDetails").post(getAllocationDetails);
export default router;

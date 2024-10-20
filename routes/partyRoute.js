import express from "express";
import {
 registerParty,
 getParty,
 getAllParty,
 deleteParty,
 updateParty,
} from "../controller/partyController.js";

import { protect, protectRefreshToken } from "../middlewares/authMiddleware.js";
import { errorHandler } from "../middlewares/errorMiddleware.js"; // Assuming you have an error handling middleware

const router = express.Router();

router.route("/").post(protect,registerParty);
router.route("/getPartyByName").post(protect, getParty);
router.route("/getAllParty").post(protect, getAllParty);
router.route("/:id").delete(deleteParty)
router.route("/:id").patch(updateParty)
router.use(errorHandler);
export default router;

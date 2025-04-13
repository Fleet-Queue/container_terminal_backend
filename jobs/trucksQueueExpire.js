import cron from "node-cron";
import mongoose from "mongoose";
import TruckBooking from "../modals/truckBookingModal.js";

// Schedule the cron job to run daily at 12 AM
cron.schedule("0 0 * * *", async () => {
  console.log("Running cron job to update status of 'inqueue' bookings to 'expired'...");

  try {
    // Update all bookings with status 'inqueue' to 'expired'
    const result = await TruckBooking.updateMany(
      { status: "inqueue" },
      { $set: { status: "expired" } }
    );

    console.log(`Cron job completed. Updated ${result.modifiedCount} bookings.`);
  } catch (error) {
    console.error("Error while running the cron job:", error);
  }
});
import AsyncHandler from "express-async-handler";
import DoBooking from "../modals/doBookingModal.js";
import Party from "../modals/partyModal.js";
import Company from "../modals/companyModal.js";
import DOBooking from "../modals/doBookingModal.js";
const registerBooking = AsyncHandler(async (req, res) => {
  const { itemName,partyId, companyId, truckType, rate, availableFrom } = req.body;

  const party = await Party.findById(partyId);
  if (!party) {
    res.status(404);
    throw new Error("party not found");
  }

  const company = await Company.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error("company not found");
  }

  const newBooking = await DoBooking.create({
    partyId,
    itemName,
    companyId,
    truckType,
    rate,
    availableFrom,
  });

  if (newBooking) {
    res.status(201).json({
      msg: "new Booking Created successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

const getDoById = AsyncHandler(async (req, res) => {
  const { doId } = req.body;
  const booking = await DOBooking.findById(doId);
  if (booking) {
    res.status(201).json(booking);
  } else {
    res.status(404);
    throw new Error("booking not found");
  }
});

const getAllBooking = AsyncHandler(async (req, res) => {
  let queryCondition = {
    companyId: req.user.companyId,
  };
  if (req.body.status) {
    queryCondition.status = req.body.status;
  }
  const bookings = await DoBooking.find(queryCondition);
  if (bookings) {
    res.status(201).json(bookings);
  } else {
    res.status(404);
    throw new Error("bookings not found");
  }
});

export { registerBooking, getDoById, getAllBooking };
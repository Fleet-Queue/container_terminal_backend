import mongoose from "mongoose";
import AsyncHandler from "express-async-handler";
import DoBooking from "../modals/doBookingModal.js";
import Party from "../modals/partyModal.js";
import Company from "../modals/companyModal.js";
import DOBooking from "../modals/doBookingModal.js";
import DeliveryOrder from "../modals/deliveryOrderModal.js";

const uploadDeliveryOrder = AsyncHandler(async (req, res) => {
  const { doLink, name,location, uniqueName, fileName, availableFrom, type } = req.body;

  console.log("registerBooking");
  console.log(req.body);

  const company = await Company.findById(req.user.companyId);
  if (!company) {
    res.status(404);
    throw new Error("company not found");
  }

  if (company.companyType === "transporter") {
    res.status(404);
    throw new Error("its only transporter company, you cant upload do");
  }

  const lastOrder = await DeliveryOrder.aggregate([
    {
      $project: {
        doNumber: 1,
        numericDoNumber: {
          $toInt: {
            $substr: ["$doNumber", 3, -1],
          },
        },
      },
    },
    {
      $sort: { numericDoNumber: -1 },
    },
    {
      $limit: 1,
    },
  ]);

  let newOrderNumber;
  if (lastOrder && lastOrder.length > 0) {
    console.log("last order indddddddddddddddddddddddddddd");
    console.log(lastOrder);

    console.log(lastOrder.numericDoNumber);
    console.log(lastOrder[0].numericDoNumber);
    newOrderNumber = `DO-${lastOrder[0].numericDoNumber + 1}`;
  } else {
    newOrderNumber = "DO-1";
  }
  console.log(newOrderNumber);
  // Create a new delivery order
  const newBooking = await DeliveryOrder.create({
    companyId: company._id,
    doLink,
    name,
    location,
    uniqueName,
    fileName,
    doNumber: newOrderNumber,
    availableFrom: availableFrom,
    type: type,
  });

  if (newBooking) {
    res.status(201).json({
      msg: "new DO uploaded successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

const updateDeliveryOrder = AsyncHandler(async (req, res) => {
  const { id } = req.params; // Get the ID from request parameters
  const { doLink, name, uniqueName, location, fileName, type, availableFrom } = req.body;

  console.log("updateDeliveryOrder");
  console.log(req.body);

  const company = await Company.findById(req.user.companyId);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  if (company.companyType === "transporter") {
    res.status(403);
    throw new Error("It's only a transporter company, you can't upload DO");
  }

  const existingOrder = await DeliveryOrder.findById(id);
  if (!existingOrder) {
    res.status(404);
    throw new Error("Delivery order not found");
  }

  // Update the delivery order fields
  existingOrder.doLink = doLink || existingOrder.doLink; // Update only if provided
  existingOrder.name = name || existingOrder.name; // Update only if provided
  existingOrder.uniqueName = uniqueName || existingOrder.uniqueName; // Update only if provided
  existingOrder.location  = location || existingOrder.location; // Update only if provided
  existingOrder.fileName = fileName || existingOrder.fileName; // Update only if provided
  existingOrder.availableFrom = fileName || existingOrder.availableFrom;
  existingOrder.type = type || existingOrder.type;
  // Save the updated delivery order
  const updatedOrder = await existingOrder.save();

  if (updatedOrder) {
    res.status(200).json({
      msg: "Delivery order updated successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid data for update");
  }
});

const CancelDeliveryOrder = AsyncHandler(async (req, res) => {
  const { id } = req.params; // Get the ID from request parameters
  const { cancelReason } = req.body; // Get cancel reason from request body

  // Check if cancelReason is provided
  if (!cancelReason) {
    res.status(400);
    throw new Error("Cancel reason is mandatory.");
  }

  const company = await Company.findById(req.user.companyId);
  // if (!company) {
  //   res.status(404);
  //   throw new Error("Company not found");
  // }
  if (company) {
    if (company.companyType === "transporter") {
      res.status(403);
      throw new Error("It's only a transporter company, you can't Cancel DO");
    }
  }

  const existingOrder = await DeliveryOrder.findById(id);
  if (!existingOrder) {
    res.status(404);
    throw new Error("Delivery order not found");
  }

  //if company cancel satus 6 if admin status 5
  if (company) {
    existingOrder.status = 6;
  } else {
    existingOrder.status = 5;
  }

  existingOrder.cancelReason = cancelReason;

  const updatedOrder = await existingOrder.save();

  if (updatedOrder) {
    res.status(200).json({
      msg: "Delivery order canceled successfully",
      order: updatedOrder,
    });
  } else {
    res.status(400);
    throw new Error("Failed to cancel the delivery order");
  }
});

const getAllDeliveryOrder = AsyncHandler(async (req, res) => {
  const companyId = req.body.companyId || req.user.companyId;
  let queryCondition = {};

  if (companyId) {
    queryCondition = { companyId: companyId };
  }
  console.log(req.body);
  console.log(req.body.status);
  if (req.body.status !== undefined) {
    queryCondition.status = req.body.status;
  }

  const Dos = await DeliveryOrder.find(queryCondition).sort({ createdAt: -1 });
  const statusMapping = {
    0: "pending",
    1: "inqueue",
    2: "allocated",
    3: "ongoing",
    4: "completed",
    5: "rejected",
    6: "cancelled",
  };
  if (Dos) {
    const transformedDos = Dos.map((doItem) => {
      const createdAtDate = new Date(doItem.createdAt);
      const uploadDate = createdAtDate.toLocaleDateString("en-GB"); // Format as dd/mm/yyyy
      const availableFrom = doItem.availableFrom.toLocaleDateString("en-GB");
      console.log(statusMapping[doItem.status]);
      return {
        _id: doItem._id,
        name: doItem.name,
        location: doItem.location,
        companyId: doItem.companyId,
        uniqueName: doItem.uniqueName,
        availableFrom: availableFrom,
        cancelReason: doItem.cancelReason,
        doNumber: doItem.doNumber,
        type: doItem.type,
        link: doItem.doLink,
        fileName: doItem.fileName,
        status: statusMapping[doItem.status],
        __v: doItem.__v,
        uploadDate: uploadDate, // Add the formatted date as uploadDate
      };
    });

    res.status(201).json(transformedDos);
  } else {
    res.status(404);
    throw new Error("Do's not found");
  }
});

const registerBooking = AsyncHandler(async (req, res) => {
  const {
    partyId,
    truckType,
    rate,
    availableFrom,
    autoBooking,
    companyId,
    deliveryOrderId,
  } = req.body;

  if (req.user.companyId) {
    res.status(404);
    throw new Error("dont have access to make booking");
  }


  //check for already exist deliveryOrder
  const deliveryOrder = await DeliveryOrder.findById(deliveryOrderId);
  if (!deliveryOrder) {
    res.status(404);
    throw new Error("Delivery order not found");
  }

  //later add cancelled reason to do booking tooo. then manage it. 
  // current issue: now if we cancel booking then it will not be deleted from do booking. no reason also available so no matter in keeping.
  // but causing conflict when picking booking
  const cancelledBooking = await DoBooking.findOne({
    deliveryOrderId: deliveryOrderId,
    status: "cancelled"
  });
  
  if (cancelledBooking) {
    await DoBooking.deleteOne({ _id: cancelledBooking._id });
    console.log("Cancelled booking deleted, proceeding with new booking.");
  }

  const doBooking = await DoBooking.findOne({
    deliveryOrderId: deliveryOrderId,
    status: { $ne: "cancelled" }
  });
  if (doBooking) {
    res.status(409);
    throw new Error("DO Booking already created for this Delivery oder");
  }

  //if autoBooking then auto allocate
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
    companyId,
    truckType,
    deliveryOrderId,
    rate,
    availableFrom,
  });

  if (newBooking) {
    deliveryOrder.status = 1;
    await deliveryOrder.save();
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

///party populate
const getAllBooking = AsyncHandler(async (req, res) => {
  let queryCondition = {};
  let companyId = req.body.companyId || req.user.companyId;
  if (companyId) {
    queryCondition.companyId = companyId;
  }
  if (req.body.status) {
    queryCondition.status = req.body.status;
  }
  if (req.body.partyId) {
    queryCondition.partyId = req.body.partyId;
  }

  if (req.body.date) {
    const dateParts = req.body.date.split('/'); // Split the date string by '/'
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed in JavaScript
      const year = parseInt(dateParts[2], 10);
  
      const istDate = new Date(year, month, day); // Create a valid Date object in IST
      if (isNaN(istDate.getTime())) {
        res.status(400);
        throw new Error("Invalid date format. Please provide a valid date.");
      }
  
      // Convert IST date to UTC
      const utcStartDate = new Date(istDate.getTime() - (5 * 60 + 30) * 60 * 1000); // Subtract 5 hours 30 minutes
      const utcEndDate = new Date(utcStartDate);
      utcEndDate.setDate(utcEndDate.getDate() + 1); // Add 1 day for the end range
  
      queryCondition.updatedAt = {
        $gte: utcStartDate, // Greater than or equal to the start of the day in UTC
        $lt: utcEndDate, // Less than the start of the next day in UTC
      };
    } else {
      res.status(400);
      throw new Error("Invalid date format. Please use DD/MM/YYYY.");
    }
  }
  // Fetch bookings and populate 'partyId'
  const bookings = await DoBooking.find(queryCondition)
  .populate("partyId")
  .populate({
    path: "deliveryOrderId",
    populate: {
      path: "companyId",
      model: "Company" // or whatever your Company model name is
    }
  });

  // Map over bookings to format the date
  const formattedBookings = bookings.map((booking) => ({
    ...booking.toObject(),
    availableFrom: new Date(booking.availableFrom).toLocaleDateString("en-GB"),
    reason: booking.deliveryOrderId?.cancelReason,
    doNumber: booking.deliveryOrderId.doNumber,
  }));

  console.log(formattedBookings);

   res.status(200).json(formattedBookings.length > 0 ? formattedBookings : []);
});

const deleteDo = AsyncHandler(async (req, res) => {
  const { doId } = req.body;
  const booking = await DOBooking.findByIdAndDelete(doId);
  if (booking) {
    res.status(200).json(booking);
  } else {
    res.status(404);
    throw new Error("booking not found");
  }
});

const deleteDeliveryOrder = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  const doOrder = await DeliveryOrder.findByIdAndDelete(id);
  if (doOrder) {
    res.status(201).json(doOrder);
  } else {
    res.status(404);
    throw new Error("delivery order not found");
  }
});

const CancelDoBooking = AsyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { cancelReason } = req.body;

    // Check if cancelReason is provided
    if (!cancelReason) {
      res.status(400);
      throw new Error("Cancel reason is mandatory.");
    }

    // Fetch company to check if the user belongs to a valid company
    // const company = await Company.findById(req.user.companyId).session(session);
    // if (!company) {
    //   res.status(404);
    //   throw new Error("Company not found");
    // }

    // Fetch existing DO booking
    const existingDo = await DOBooking.findById(id).session(session);
    if (!existingDo) {
      res.status(404);
      throw new Error("Delivery Booking not found");
    }

    // Fetch existing order
    const existingOrder = await DeliveryOrder.findById(
      existingDo.deliveryOrderId
    ).session(session);
    if (!existingOrder) {
      res.status(404);
      throw new Error("Delivery Order not found");
    }

    // Update statuses and reasons
    existingDo.status = "cancelled";
    existingOrder.cancelReason = cancelReason;
    existingOrder.status = 6;

    // Save the changes within the transaction
    const updatedOrder = await existingOrder.save({ session });
    const updatedDoBooking = await existingDo.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      msg: "Delivery order canceled successfully",
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(400).json({
      msg: "Failed to cancel the delivery order",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
});

const ReOpenDoBooking = AsyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    let cancelReason = "ReOpened booking";

      // Fetch company to check if the user belongs to a valid company
    const company = await Company.findById(req.user.companyId).session(session);
    if (company) {
      res.status(404);
      throw new Error("user dont have action to perform this operation");
    }


    // Fetch existing DO booking
    const existingDo = await DOBooking.findById(id).session(session);
    if (!existingDo) {
      res.status(404);
      throw new Error("Delivery Booking not found");
    }

    // Fetch existing order
    const existingOrder = await DeliveryOrder.findById(
      existingDo.deliveryOrderId
    ).session(session);
    if (!existingOrder) {
      res.status(404);
      throw new Error("Delivery Order not found");
    }

    // Update statuses and reasons
    existingDo.status = "cancelled";
    existingOrder.cancelReason = cancelReason;
    existingOrder.status = 0;

    // Save the changes within the transaction
    const updatedOrder = await existingOrder.save({ session });
    const updatedDoBooking = await existingDo.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      msg: "Delivery order Reopened successfully",
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(400).json({
      msg: "Failed to Reopened the delivery order",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
});

export {
  registerBooking,
  getDoById,
  getAllBooking,
  deleteDo,
  uploadDeliveryOrder,
  CancelDeliveryOrder,
  updateDeliveryOrder,
  getAllDeliveryOrder,
  deleteDeliveryOrder,
  CancelDoBooking,
  ReOpenDoBooking
};

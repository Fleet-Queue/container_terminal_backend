import AsyncHandler from "express-async-handler";
import Location from "../modals/locationModal.js";
import DeliveryOrder from "../modals/deliveryOrderModal.js";
import Allocation from "../modals/allocationModal.js";
import TruckBooking from "../modals/truckBookingModal.js"
import DOBooking from "../modals/doBookingModal.js";
import mongoose from "mongoose";
const doAllocation = AsyncHandler(async (req, res) => {
  const { doBookingId, doDate,truckBookingId } = req.body;


  const doAllocationExist = await Allocation.findOne({
    DOBookingId: doBookingId,
    status: { $ne: "cancelled" }
  });
  if (doAllocationExist) {
    res.status(403);
    throw new Error("This do is already allocated");
  }
 
 

 let doExist = await DOBooking.findById(doBookingId)

 if(!doExist || doExist.status != "open"){
  res.status(403);
  throw new Error("Do not found or its not open");
 }


 const deliveryOrder = await DeliveryOrder.findById(doExist.deliveryOrderId)
 if (!deliveryOrder) {
   res.status(403);
   throw new Error("This delivery order is not exist");
 }


  
 

  let truckBooking = await TruckBooking.findById(truckBookingId);
  if (!truckBooking) {
    res.status(404);
    throw new Error("truck not found");
  }

  console.log("Dateeeeeeeeeeeeeeeeeee")
  console.log(truckBooking.availableFrom)
  console.log(doDate)

  console.log("Dateeeeeeeeeeeeeeeeeee")

  if(truckBooking.availableFrom<doDate){
    res.status(400);
    throw new Error("truck is not available in the date");
  }

  if(truckBooking.status!="inqueue"){
    res.status(400);
    throw new Error("truck is not in the queue");
  }

  const newAllocation = await Allocation.create({
    DOBookingId:doBookingId,
    truckBookingId:truckBookingId
  });

  if(newAllocation){
     
    doExist.status = "allocated"
    await doExist.save();

    deliveryOrder.status = 2
    await deliveryOrder.save();

    truckBooking.status = "allocated"
    await truckBooking.save()

    res.status(201).json({
      msg: "new allocation addded successfully",
    });

  }else{
    res.status(400);
    throw new Error("Invalid data for allocation");
  }

 
});




const CancelAllocatedBooking = AsyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { cancelReason } = req.body;

    if (!cancelReason) {
      res.status(400);
      throw new Error("Cancel reason is mandatory.");
    }

 console.log(id)
    const doAllocationExist = await Allocation.findOne({"DOBookingId":id}).session(session);
    if (!doAllocationExist) {
      res.status(403);
      throw new Error("Allocation not found");
    }
   

    const truckBookingIdExist = await TruckBooking.findById(doAllocationExist.truckBookingId).session(session);
    if (!truckBookingIdExist) {
      res.status(403);
      throw new Error("truckBooking not found");
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

    const existingOrder = await DeliveryOrder.findById(existingDo.deliveryOrderId).session(session);
    if (!existingOrder) {
      res.status(404);
      throw new Error("Delivery Order not found");
    }


    doAllocationExist.status = "cancelled"
    doAllocationExist.cancelReason = cancelReason;
    existingDo.status = "cancelled";
    existingOrder.cancelReason = cancelReason;
    existingOrder.status = 6;
    truckBookingIdExist.status = "inqueue";

    const updatedOrder = await existingOrder.save({ session });
    const updatedDoAllocation = await doAllocationExist.save({ session });
    const updatedDoExisting = await existingDo.save({ session });
    const updatedtruckBooking = await truckBookingIdExist.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      msg: "Allocated order canceled successfully"
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(400).json({
      msg: "Failed to cancel the Allocated order",
      error: error.message
    });
  } finally {
    session.endSession();
  }
});



const ReAllocateBooking = AsyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

   let cancelReason = "Re Allocation";
    const doAllocationExist = await Allocation.findOne({"DOBookingId":id}).session(session);
    if (!doAllocationExist) {
      res.status(403);
      throw new Error("Allocation not found");
    }
   

    const truckBookingIdExist = await TruckBooking.findById(doAllocationExist.truckBookingId).session(session);
    if (!truckBookingIdExist) {
      res.status(403);
      throw new Error("truckBooking not found");
    }
    const existingDo = await DOBooking.findById(id).session(session);
    if (!existingDo) {
      res.status(404);
      throw new Error("Delivery Booking not found"); 
    }

    const existingOrder = await DeliveryOrder.findById(existingDo.deliveryOrderId).session(session);
    if (!existingOrder) {
      res.status(404);
      throw new Error("Delivery Order not found");
    }


    doAllocationExist.status = "cancelled"
    doAllocationExist.cancelReason = cancelReason;
    existingDo.status = "open";
    existingOrder.status = 1;
    truckBookingIdExist.status = "inqueue";

    const updatedOrder = await existingOrder.save({ session });
    const updatedDoAllocation = await doAllocationExist.save({ session });
    const updatedDoExisting = await existingDo.save({ session });
    const updatedtruckBooking = await truckBookingIdExist.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      msg: "Allocated order Ready For Reallocation"
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(400).json({
      msg: "Failed to Reallocate the Allocated order",
      error: error.message
    });
  } finally {
    session.endSession();
  }
});


const doAutoAllocation = AsyncHandler(async (req, res) => {
  const { doBookingId, doDate, truckBookingId } = req.body;


  const doAllocationExist = await Allocation.findOne({DOBookingId:doBookingId});
  if (doAllocationExist) {
    res.status(403);
    throw new Error("This do is already allocated");
  }

 let doExist = await DOBooking.findById(doBookingId)

 if(!doExist || doExist.status != "open"){
  res.status(403);
  throw new Error("Do not found or its not open");
 }



  //find truck bookings with conditions...................
 

  let truckBooking = await TruckBooking.findById(truckBookingId);
  if (!truckBooking) {
    res.status(404);
    throw new Error("truck not found");
  }

  if(truckBooking.availableFrom<doDate){
    res.status(400);
    throw new Error("truck is not available in the date");
  }

  if(truckBooking.status!="inqueue"){
    res.status(400);
    throw new Error("truck is not in the queue");
  }

  const newAllocation = await Allocation.create({
    DOBookingId:doBookingId,
    truckBookingId:truckBookingId
  });

  if(newAllocation){

    doExist.status = "allocated"
    await doExist.save();

    truckBooking.status = "allocated"
    await truckBooking.save()

    res.status(201).json({
      msg: "new allocation addded successfully",
    });

  }else{
    res.status(400);
    throw new Error("Invalid data for allocation");
  }

 
});

const getAllAllocationDetails = AsyncHandler(async (req, res) => {
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

  let doBookingIds = [];

  if (req.body.date) {
    const dateParts = req.body.date.split('/');
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const year = parseInt(dateParts[2], 10);

      const utcStartDate = new Date(Date.UTC(year, month, day));
      const utcEndDate = new Date(Date.UTC(year, month, day + 1));

      // Fetch allocations matching the date range
      const allocations = await Allocation.find({
        allocatedOn: { $gte: utcStartDate, $lt: utcEndDate }
      });

      doBookingIds = allocations.map((a) => a.DOBookingId.toString());

      // If no matching allocations, return early
      if (doBookingIds.length === 0) {
        return res.status(200).json([]);
      }

      // Filter DOBooking by matching IDs
      queryCondition._id = { $in: doBookingIds };
    } else {
      res.status(400);
      throw new Error("Invalid date format. Please use DD/MM/YYYY.");
    }
  }

  // Fetch bookings and populate related data
  const bookings = await DOBooking.find(queryCondition)
    .populate("partyId")
    .populate({
      path: "deliveryOrderId",
      populate: {
        path: "companyId",
        model: "Company"
      }
    })
    .populate("companyId")
    .sort({ createdAt: 1 });

  const formattedBookings = bookings.map((booking) => ({
    ...booking.toObject(),
    availableFrom: new Date(booking.availableFrom).toLocaleDateString("en-GB"),
    reason: booking.deliveryOrderId?.cancelReason,
    doNumber: booking.deliveryOrderId?.doNumber,
    companyName: booking.companyId?.name,
    name: booking.deliveryOrderId?.name,
    location: booking.deliveryOrderId?.location,
  }));

  res.status(200).json(formattedBookings);
});



const getAllocationDetails = AsyncHandler(async (req, res) => {
  const { doBookingId } = req.body;

  const doAllocation = await Allocation.findOne({ DOBookingId: doBookingId })
  .populate({
    path: 'truckBookingId',
    populate: {
      path: 'truck',
      select: '-createdAt -updatedAt -__v',
      populate: [
        { path: 'companyId', select: '-createdAt -updatedAt -__v' },
        { path: 'driverId', select: '-createdAt -updatedAt -__v' }
      ]
    }
  })
  .select('-DOBookingId');
  if (!doAllocation) {
    res.status(404);
    throw new Error("do allocation not found");
  }else{
    console.log(doAllocation.truckBookingId._id)
  
    const truckDetails = await TruckBooking.findById(doAllocation.truckBookingId._id).populate('truck')
    console.log(truckDetails)
    // const truckDetails = await Allocation.findOne({DOBookingId:doBookingId}).populate('truckBookingId')

    res.status(201).json(doAllocation);
  }

});



//to make status ongoin and done
const changeAllocationStatus = AsyncHandler(async (req, res) => {
  let { status, allocId } = req.body;
  
  // Validate status
  if (status != "ongoing" && status != "done") {
    res.status(400);
    throw new Error("Invalid status for allocation");
  }

  // Find allocation and populate related fields
  const allocation = await Allocation.findById(allocId).populate({
    path: 'truckBookingId',
    populate: {
      path: 'truck',
      populate: [
        { path: 'companyId', select: '-createdAt -updatedAt -__v' },
        { path: 'driverId', select: '-createdAt -updatedAt -__v' }
      ]
    }
  }).populate('DOBookingId');

  // Check if allocation exists
  if (!allocation) {
    res.status(404);
    throw new Error("Allocation not found");
  }

  // Determine the new status values
  let newAllocationStatus;
  let newTruckBookingStatus;
  let newDOBookingStatus;

  if (status === "ongoing") {
    newAllocationStatus = "ongoing";
    newTruckBookingStatus = "ongoing";
  } else if (status === "done") {
    newAllocationStatus = "expired";
    newTruckBookingStatus = "expired";
    newDOBookingStatus = "expired";
  }

  // Update the statuses
  allocation.status = newAllocationStatus;
  allocation.truckBookingId.status = newTruckBookingStatus;

  if (status === "done" && allocation.DOBookingId) {
    allocation.DOBookingId.status = newDOBookingStatus;
    await allocation.DOBookingId.save();
  }

  // Save the changes
  await allocation.save();
  await allocation.truckBookingId.save();

  // Send a success response
  res.status(200).json({
    message: "Status updated successfully",
    allocation,
  });
});



export { doAllocation,getAllocationDetails,getAllAllocationDetails,changeAllocationStatus,CancelAllocatedBooking,ReAllocateBooking};

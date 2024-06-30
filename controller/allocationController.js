import AsyncHandler from "express-async-handler";
import Location from "../modals/locationModal.js";
import DeliveryOrder from "../modals/deliveryOrderModal.js";
import Allocation from "../modals/allocationModal.js";
import TruckBooking from "../modals/truckBookingModal.js"
import DOBooking from "../modals/doBookingModal.js";

const doAllocation = AsyncHandler(async (req, res) => {
  const { doBookingId, doDate,truckBookingId } = req.body;


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



export { doAllocation,getAllocationDetails,changeAllocationStatus};

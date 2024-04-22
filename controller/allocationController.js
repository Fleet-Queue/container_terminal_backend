import AsyncHandler from "express-async-handler";
import Location from "../modals/locationModal.js";
import Truck from "../modals/truckModal.js";
import Allocation from "../modals/allocationModal.js";
import TruckBooking from "../modals/truckBookingModal.js"
import DOBooking from "../modals/doBookingModal.js";

const doAllocation = AsyncHandler(async (req, res) => {
  const { doBookingId, truckId, doDate } = req.body;


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



  let truck = await Truck.findById(truckId);
  if (!truck) {
    res.status(404);
    throw new Error("truck not found");
  }
  const newTruckBooking = await TruckBooking.create({
    truck:truckId,
    availableFrom:doDate,
  });

  if (newTruckBooking) {
    console.log("new booking added successfully");


  const newAllocation = await Allocation.create({
    DOBookingId:doBookingId,
    truckBookingId:newTruckBooking._id,
  });

  if(newAllocation){
    truck.status = "allocated";
    await truck.save();

    doExist.status = "allocated"
    await doExist.save();

    res.status(201).json({
      msg: "new allocation addded successfully",
    });

  }else{
    res.status(400);
    throw new Error("Invalid data for allocation");
  }

  } else {
    res.status(400);
    throw new Error("Invalid data");
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




export { doAllocation,getAllocationDetails };

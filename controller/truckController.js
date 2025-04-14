import AsyncHandler from "express-async-handler";
import Truck from "../modals/truckModal.js";
import Company from "../modals/companyModal.js";
import Driver from "../modals/driverModal.js";
import TruckBooking from "../modals/truckBookingModal.js";
import Allocation from "../modals/allocationModal.js";

const registerTruck = AsyncHandler(async (req, res) => {
  const { name, registrationNumber, driverId, companyId, category, truckType } =
    req.body;

  const truck = await Truck.findOne({ registrationNumber: registrationNumber });
  if (truck) {
    res.status(403);
    throw new Error("Truck exists with same Registration number");
  }

  const company = await Company.findById(companyId);
  if (!company) {
    res.status(403);
    throw new Error("company does not exist");
  }

  const driver = await Driver.findById(driverId);
  if (!driver) {
    res.status(403);
    throw new Error("driver does not exist");
  }

  const newTruck = await Truck.create({
    name,
    registrationNumber,
    driverId,
    companyId,
    category,
    truckType,
  });

  if (newTruck) {
    res.status(201).json({
      msg: "new truck added successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

const addTruckToBooking = AsyncHandler(async (req, res, next) => {
  const { truckId, availableFrom } = req.body;

  const truck = await Truck.findById(truckId);
  if (!truck) {
    res.status(400);
    throw new Error("Truck not found");
  }

  const tBooking = await TruckBooking.findOne({
    truck: truckId,
    status: { $in: ["inqueue", "allocated"] },
  });



  if (tBooking) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00
    
    const availableDate = new Date(tBooking.availableFrom);
    availableDate.setHours(0, 0, 0, 0);
    if (availableDate >= today) {
      res.status(409);
      throw new Error("Truck is already in queue, not expired yet");
    } else {
      // Update existing booking status to "expired"
      await TruckBooking.findByIdAndUpdate(tBooking._id, { status: "expired" });
    }
  }

  const newTruckBooking = await TruckBooking.create({
    truck: truckId,
    availableFrom,
  });

  if (newTruckBooking) {
    res.status(201).json({
      msg: "new truck added to Booking successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

const getTruckByNumber = AsyncHandler(async (req, res) => {
  const { registrationNumber } = req.body;
  const truck = await Truck.findOne({
    registrationNumber: registrationNumber,
  }).populate("driverId");
  if (truck) {
    if (!truck.companyId.equals(req.user.companyId)) {
      res.status(404);
      throw new Error(
        "Access Denied, You dont have access to get this truck details"
      );
    }
    res.status(201).json(truck);
  } else {
    res.status(404);
    throw new Error("truck not found");
  }
});

const getTruckById = AsyncHandler(async (req, res) => {
  const { truckId } = req.body;
  const truck = await Truck.findById(truckId).populate("driverId");
  if (truck) {
    if (!truck.companyId.equals(req.user.companyId)) {
      res.status(404);
      throw new Error(
        "Access Denied, You dont have access to get this truck details"
      );
    }
    res.status(201).json(truck);
  } else {
    res.status(404);
    throw new Error("truck not found");
  }
});

const getAllTruck = AsyncHandler(async (req, res) => {
  let queryCondition = {};

  if (req.user.companyId) {
    queryCondition.companyId = req.user.companyId;
  } else if (req.body.companyId) {
    queryCondition.companyId = req.body.companyId;
  }
  if (req.body.isActive) {
    queryCondition.isActive = req.body.isActive;
  }

  if (req.body.type) {
    queryCondition.truckType = req.body.type;
  }
  const trucks = await Truck.find(queryCondition).populate("companyId");
  if (trucks) {
    const trucksWithCompanyInfo = trucks.map(truck => {
      return {
          ...truck.toObject(),
          companyId: truck.companyId._id,
          companyName: truck.companyId.name,
      };
  });
    res.status(201).json(trucksWithCompanyInfo);
  } else {
    res.status(404);
    throw new Error("no trucks found");
  }
});

// getALLTRUCKBOOKING
const getAllTruckBookings = AsyncHandler(async (req, res) => {
  console.log("getALlTruckBook");
  console.log(req.body);
  //companyid , status,
  if (!req.user.companyId) {
    res.status(404);
    throw new Error("Company Id not found");
  }

  console.log(req.user.companyId);
  let queryCondition = {};

  if (req.body.status) {
    queryCondition.status = req.body.status;
  }

  const truckBooking = await TruckBooking.find({ ...queryCondition }).populate({
    path: "truck",
    match: { companyId: req.user.companyId }, // Filter based on 'companyId'
  });

  console.log(truckBooking);

  const validTruckBookings = truckBooking.filter((tb) => tb.truck !== null);

  console.log(validTruckBookings); // Output the filtered results to verify

  const truckBookingIds = validTruckBookings.map((tb) => tb._id);
  const allocations = await Allocation.find({
    truckBookingId: { $in: truckBookingIds },
  });

  const results = await Promise.all(
    validTruckBookings.map(async (tb) => {
      const allocation = allocations.find((allocation) =>
        allocation.truckBookingId.equals(tb._id)
      );
      console.log(allocation);
      if (allocation) {
        // Use populate and await it directly
        await allocation.populate("DOBookingId");
        await allocation.DOBookingId.populate("partyId");
        await allocation.DOBookingId.partyId.populate("locationId");
      }
      return {
        ...tb.toObject(), // Convert Mongoose document to plain JavaScript object
        allocation: allocation ? allocation.toObject() : null, // Add allocation information
      };
    })
  );

  if (results) {
    res.status(201).json(results);
  } else {
    res.status(404);
    throw new Error("no trucks found");
  }
});

const getAllInqueTrucks = AsyncHandler(async (req, res) => {
  // Fetch all bookings with status "inqueue"
  const truckBooking = await TruckBooking.find({ status: "inqueue" }).populate({
    path: "truck",
    populate: {
      path: "companyId",
    },
  });

  let filteredTruckBookings = truckBooking;

  // Filter by truck type if provided
  if (req.body.type) {
    filteredTruckBookings = filteredTruckBookings.filter(
      (tb) => tb.truck.truckType === req.body.type
    );
  }

  // Filter by date (only comparing the date portion, not time)
  if (req.body.date) {
    const dateParts = req.body.date.split('/'); // Assuming format: dd/mm/yyyy
    const stripTime = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const requestDate = stripTime(new Date(dateParts[2], dateParts[1] - 1, dateParts[0]));
    console.log("body date", req.body.date);
    console.log("request date", requestDate);
    // filteredTruckBookings = filteredTruckBookings.filter((tb) => {
    //   const bookingDate = stripTime(new Date(tb.availableFrom));
    //   console.log("booking date", bookingDate);
    //   return bookingDate <= requestDate;
    // });
  }



  console.log("Filtered Truck Bookings:", filteredTruckBookings);

  if (filteredTruckBookings.length > 0) {
    res.status(201).json(filteredTruckBookings);
  } else {
    res.status(200).json([]);
  }
});



const getTruckQueue = AsyncHandler(async (req, res) => {
  const { type, date } = req.body;

  // Get all 'inqueue' bookings with truck and company details
  let truckBookings = await TruckBooking.find({ status: "inqueue" }).populate({
    path: "truck",
    populate: {
      path: "companyId",
    },
  });

  // Filter by truckType if provided
  if (type) {
    const numericType = Number(type);
    truckBookings = truckBookings.filter(tb => tb.truck.truckType === numericType);
  }

  // Filter by date if provided
  if (date) {
    const [day, month, year] = date.split('/');
    const targetDate = new Date(year, month - 1, day);
    
    const stripTime = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    truckBookings = truckBookings.filter(tb => {
      const bookingDate = stripTime(new Date(tb.availableFrom));
      return bookingDate.getTime() === stripTime(targetDate).getTime();
    });
  }

  res.status(200).json(truckBookings);
});


const updateStatus = AsyncHandler(async (req, res) => {
  const { truckId, isActive } = req.body;
  const truck = await Truck.findById(truckId);
  if (truck) {
    if (!truck.companyId.equals(req.user.companyId)) {
      res.status(404);
      throw new Error(
        "Access Denied, You dont have access to get this truck details"
      );
    }
    truck.status = status;
    await truck.save();

    //if truck in the truckBooking we need to make cancel that truck

    const tBooking = await TruckBooking.findOne({
      truck: truckId,
      status: "inqueue",
    });

    if (tBooking) {
      tBooking.status = "cancelled";
      await tBooking.save();
    }
    res
      .status(200)
      .json({ message: "Truck status updated successfully", truck });
  } else {
    res.status(404);
    throw new Error("truck not found");
  }
});

const updateTruckBookingStatus = AsyncHandler(async (req, res) => {
  const { TruckBookingId, status, cancelReason } = req.body;
  if (status == "cancelled" && !cancelReason) {
    res.status(404);
    throw new Error("please provide cancellation reason");
  }
  const truck = await TruckBooking.findById(TruckBookingId);
  if (truck) {
    truck.status = status;
    if (cancelReason) {
      truck.cancellationReason = cancelReason;
    }
    await truck.save();

    //if truck in the truckBooking we need to make cancel that truck
    res
      .status(200)
      .json({ message: "Truck Booking status updated successfully", truck });
  } else {
    res.status(404);
    throw new Error("truck not found");
  }
});

const updateTruck = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Truck ID is required" });
  }

  try {
    const updatedTruck = await Truck.findByIdAndUpdate(id, req.body, {
      new: true, // return the updated document rather than the original
      runValidators: true, // run schema validators
    });

    if (!updatedTruck) {
      return res.status(404).json({ message: "Truck not found" });
    }

    res.status(200).json({
      message: "Truck updated successfully",
      company: updatedTruck,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const deleteTruck = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Truck ID is required" });
  }

  try {
    const truck = await Truck.findByIdAndDelete(id);

    if (!truck) {
      return res.status(404).json({ message: "Truck not found" });
    }

    res.status(200).json({ message: "Truck deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export {
  registerTruck,
  getTruckByNumber,
  getTruckById,
  getAllTruck,
  updateStatus,
  updateTruck,
  deleteTruck,
  addTruckToBooking,
  updateTruckBookingStatus,
  getAllInqueTrucks,
  getAllTruckBookings,
  getTruckQueue
};

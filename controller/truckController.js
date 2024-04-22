import AsyncHandler from "express-async-handler";
import Truck from "../modals/truckModal.js";
import Company from "../modals/companyModal.js";
import Driver from "../modals/driverModal.js";

const registerTruck = AsyncHandler(async (req, res) => {
  const { name, registrationNumber, driverId, companyId, category, truckType } =
    req.body;

  const truck = await Truck.findOne({ registrationNumber: registrationNumber });
  if (truck) {
    res.status(403);
    throw new Error("user exists with same Registration number");
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

const getTruckByNumber = AsyncHandler(async (req, res) => {
  const { registrationNumber } = req.body;
  const truck = await Truck.findOne({ registrationNumber: registrationNumber }).populate('driverId');
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
  const truck = await Truck.findById(truckId).populate('driverId');
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
  if (!req.user.companyId) {
    res.status(404);
    throw new Error("Company Id not found");
  }
  let queryCondition = { companyId: req.user.companyId };

  if (req.body.status) {
    queryCondition.status = req.body.status;
  }

  if (req.body.type) {
    queryCondition.truckType = req.body.type;
  }
  const trucks = await Truck.find(queryCondition).populate('companyId')
  if (trucks) {
    res.status(201).json(trucks);
  } else {
    res.status(404);
    throw new Error("no trucks found");
  }
});



const updateStatus = AsyncHandler(async (req, res) => {
  const { truckId, status } = req.body;
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
    res
      .status(200)
      .json({ message: "Truck status updated successfully", truck });
  } else {
    res.status(404);
    throw new Error("truck not found");
  }
});

const deleteTruck = AsyncHandler(async (req, res) => {
  const { truckId } = req.body;
  const truck = await Truck.findById(truckId);
  if (truck) {
    if (!truck.companyId.equals(req.user.companyId)) {
      res.status(404);
      throw new Error(
        "Access Denied, You dont have access to get this truck details"
      );
    }

    await truck.deleteOne({ _id: truck._id });
    res.status(200).json({ message: "Truck deleted successfully" });
  } else {
    res.status(404);
    throw new Error("truck not found");
  }
});
export {
  registerTruck,
  getTruckByNumber,
  getTruckById,
  getAllTruck,
  updateStatus,
  deleteTruck,
};

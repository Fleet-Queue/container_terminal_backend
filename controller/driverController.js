import AsyncHandler from "express-async-handler";
import Driver from "../modals/driverModal.js";
import Company from "../modals/companyModal.js";

const registerDriver = AsyncHandler(async (req, res) => {
  const {
    name,
    contactNumber,
    address,
    licenceNumber,
    licenceType,
    expiryDate,
    companyId,
  } = req.body;

  const driver = await Driver.findOne({ licenceNumber: licenceNumber });
  if (driver) {
    res.status(403);
    throw new Error("user exists with same licence number");
  }

  const company = await Company.findById(companyId);
  if (!company) {
    res.status(400);
    throw new Error("Company not Found");
  }

  const newDriver = await Driver.create({
    name,
    contactNumber,
    address,
    licenceNumber,
    licenceType,
    expiryDate,
    companyId,
  });

  if (newDriver) {
    res.status(201).json({
      msg: "new driver created successfully",
      userId: newDriver._id,
    });
  } else {
    res.status(400);
    throw new Error("Invalid driverData");
  }
});

const getDriverByName = AsyncHandler(async (req, res) => {
  const { name } = req.body;
  const driver = await Driver.findOne({ name: name });
  if (driver) {
    res.status(201).json(driver);
  } else {
    res.status(404);
    throw new Error("invalid driver");
  }
});

const getAllDrivers = AsyncHandler(async (req, res) => {
  const { companyId } = req.body;
  let queryCondition = {};
  console.log(req.user);
  if (req.user.companyId) {
    queryCondition.companyId = req.user.companyId;
  } else if (companyId) {
    queryCondition = { companyId: companyId };
  }
  const drivers = await Driver.find(queryCondition).populate("companyId");
  if (drivers) {
    const transformedDrivers = drivers.map((driver) => ({
      _id: driver._id,
      name: driver.name,
      companyName: driver.companyId.name,
      address: driver.address,
      contactNumber: driver.contactNumber,
      licenceNumber: driver.licenceNumber,
      licenceType: driver.licenceType,
      expiryDate: driver.expiryDate,
      status: driver.status,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt,
      __v: driver.__v,
    }));

    res.status(201).json(transformedDrivers);
  } else {
    res.status(404);
    throw new Error("No driver found");
  }
});

const getDriverByPhone = AsyncHandler(async (req, res) => {
  const { contactNumber } = req.body;
  const driver = await Driver.findOne({ contactNumber: contactNumber });

  if (driver) {
    res.status(201).json(driver);
  } else {
    res.status(404);
    throw new Error("invalid driver");
  }
});

const getCompanyDrivers = AsyncHandler(async (req, res) => {

  if (!req.body.companyId) {
    res.status(404);
    throw new Error("Company Id not found");
  }
  let companyId = req.body.companyId;
  const drivers = await Driver.find({ companyId });

  res.status(201).json(drivers);
});




const updateDriver = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Driver ID is required" });
  }

  try {
    const updatedDriver = await Driver.findByIdAndUpdate(id, req.body, {
      new: true, // return the updated document rather than the original
      runValidators: true, // run schema validators
    });

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({
      message: "Driver updated successfully",
      company: updatedDriver,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const deleteDriver = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Driver ID is required" });
  }

  try {
    const driver = await Driver.findByIdAndDelete(id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export {
  registerDriver,
  getDriverByName,
  getAllDrivers,
  getDriverByPhone,
  getCompanyDrivers,
  updateDriver,
  deleteDriver
};

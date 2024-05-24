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
    expiryDate
  } = req.body;

  if (!req.user.companyId) {
    res.status(404);
    throw new Error("Company Id not found");
  }
  let companyId = req.user.companyId

  const driver = await Driver.findOne({ licenceNumber: licenceNumber });
  if (driver) {
    res.status(403);
    throw new Error("user exists with same licence number");
  }

  const company = await Company.findById(companyId);
    if(!company){
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
    companyId
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
  console.log("getCompanyDrivers")
  if (!req.user.companyId) {
    res.status(404);
    throw new Error("Company Id not found");
  }
  let companyId = req.user.companyId
  const drivers = await Driver.find({ companyId });

    res.status(201).json(drivers);

});

export { registerDriver, getDriverByName, getDriverByPhone,getCompanyDrivers };

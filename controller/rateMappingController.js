import AsyncHandler from "express-async-handler";
import Location from "../modals/locationModal.js";
import RateMapping from "../modals/rateMappingModal.js";
const registerRate = AsyncHandler(async (req, res) => {
  const { locationId, truckCategory, truckType, rate } = req.body;

  const location = await Location.findById(locationId);
  if (!location) {
    res.status(404);
    throw new Error("location not found");
  }

  const exist = await RateMapping.findOne({locationId,truckCategory,truckType})
  if (exist) {
    res.status(404);
    throw new Error("Rate already added for "+location.name +", Category:"+ truckCategory+" ,type:"+ truckType);
  }
  const newRate = await RateMapping.create({
    locationId, truckCategory, truckType, rate
  });

  if (newRate) {
    res.status(201).json({
      msg: "new rate addded successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

const getRateByLocation = AsyncHandler(async (req, res) => {
  const { locationId,truckCategory,truckType } = req.body;

  const rate = await RateMapping.findOne({locationId,truckCategory,truckType})
  if (rate) {
    res.status(201).json(rate);
  } else {
    res.status(404);
    throw new Error("rate not found, add rate");
  }
});


const getAllRatesBasedOnLocation = AsyncHandler(async (req, res) => {
  const { locationName } = req.body;
  
 
  const location = await Location.findOne({ name: locationName });

  if (!location) {
    
    return res.status(404).json({ error: "Location not found" });
  }


  const rates = await RateMapping.find({ locationId: location._id }).populate('locationId');

  res.json(rates);
});
export { registerRate, getRateByLocation,getAllRatesBasedOnLocation };

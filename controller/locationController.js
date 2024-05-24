import AsyncHandler from "express-async-handler";
import Location from "../modals/locationModal.js";

const registerLocation = AsyncHandler(async (req, res) => {
  const { name, kilometer, tripType, isHighRangeArea } = req.body;

  const location = await Location.findOne({ name: name });
  if (location) {
    res.status(403);
    throw new Error("location exist with same name");
  }
  const newLocation = await Location.create({
    name,
    kilometer,
    tripType,
    isHighRangeArea,
  });

  if (newLocation) {
    res.status(201).json({
      msg: "new location addded successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

const getLocationByName = AsyncHandler(async (req, res) => {
  const { name } = req.body;
  const location = await Location.findOne({ name: name });
  if (location) {
    res.status(201).json(location);
  } else {
    res.status(404);
    throw new Error("location not found");
  }
});


const getAllLocation = AsyncHandler(async (req, res) => {
  const location = await Location.find().sort({ name: 1 });;
  if (location) {
    res.status(201).json(location);
  } else {
    res.status(404);
    throw new Error("location not found");
  }
});

export { registerLocation, getLocationByName,getAllLocation };

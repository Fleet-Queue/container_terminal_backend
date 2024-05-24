import AsyncHandler from "express-async-handler";
import Party from "../modals/partyModal.js";
import Location from "../modals/locationModal.js";
import Company from "../modals/companyModal.js";

const                                                                                                                                             registerParty = AsyncHandler(async (req, res) => {
  const { name, address, isTrailerAllowed, locationId,contactPerson,contactNumber } = req.body;
  const allocatedUserId = req.user._id

  if (!req.user.companyId) {
    res.status(404);
    throw new Error("Company Id not found");
  }
  const party = await Party.findOne({ name: name });
  if (party) {
    res.status(403);
    throw new Error("party exist with same name");
  }

  

  const location = await Location.findById(locationId);
  if (!location) {
    res.status(403);
    throw new Error("location with this id not found");
  }



  const newParty = await Party.create({
    name,
    address,
    isTrailerAllowed,
    locationId,
    companyId:req.user.companyId,
    allocatedUserId,
    contactPerson,
    contactNumber
  });

  if (newParty) {
    res.status(201).json({
      msg: "new party addded successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

const getParty = AsyncHandler(async (req, res) => {
  const { name } = req.body;
  const party = await Party.findOne({ name: name , companyId: req.user.companyId}).populate('locationId').populate('companyId').populate({
    path: 'allocatedUserId',
    select: '-password' // Exclude the "password" field from the populated "companyId"
  });
  
  if (party) {
    res.status(201).json(party);
  } else {
    res.status(404);
    throw new Error("party not found");
  }
});


const getAllParty = AsyncHandler(async (req, res) => {
  const party = await Party.find({companyId: req.user.companyId});
  if (party) {
    res.status(201).json(party);
  } else {
    res.status(404);
    throw new Error("parties not found");
  }
});

export { registerParty, getParty,getAllParty };

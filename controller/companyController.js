import AsyncHandler from "express-async-handler";
import Company from "../modals/companyModal.js";


const registerCompany = AsyncHandler(async (req, res) => {
  const { name, ownerName, contactNumber, address,companyType } = req.body;
//only admin can add
  const company = await Company.findOne({ name: name });
  if (company) {
    res.status(403);
    throw new Error("company exist with same name");
  }

  const isMobNumberExist = await Company.findOne({ contactNumber: contactNumber });
  if (isMobNumberExist) {
    res.status(403);
    throw new Error("another company exist with same Contact Number");
  }

  const newCompany = await Company.create({
    name, 
    ownerName, 
    contactNumber, 
    address,
    companyType
  });

  if (newCompany) {
    res.status(201).json({
      msg: "new Company addded successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

const getCompany = AsyncHandler(async (req, res) => {
  const { name } = req.body;
  const company = await Company.findOne({ name: name });
  if (company) {
    res.status(201).json(company);
  } else {
    res.status(404);
    throw new Error("company not found");
  }
});


const getAllCompany = AsyncHandler(async (req, res) => {
 const {companyTypes} = req.body;
 let queryCondition = {};
 if (companyTypes && Array.isArray(companyTypes) && companyTypes.length > 0) {
  queryCondition = { companyType: { $in: companyTypes } };
}
  const company = await Company.find(queryCondition);
  if (company) {
    res.status(201).json(company);
  } else {
    res.status(404);
    throw new Error("company not found");
  }
});
export { registerCompany, getCompany, getAllCompany };

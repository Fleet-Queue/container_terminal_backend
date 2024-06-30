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

const deleteCompany = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  console.log(req.user)
  if (!id) {
    return res.status(400).json({ message: 'Company ID is required' });
  }

  try {
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    await company.remove() // Delete the company

    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }

})
export { registerCompany, getCompany, getAllCompany,deleteCompany };

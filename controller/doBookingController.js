import AsyncHandler from "express-async-handler";
import DoBooking from "../modals/doBookingModal.js";
import Party from "../modals/partyModal.js";
import Company from "../modals/companyModal.js";
import DOBooking from "../modals/doBookingModal.js";
import DeliveryOrder from "../modals/deliveryOrderModal.js";




const uploadDeliveryOrder = AsyncHandler(async (req, res) => {
  const { doLink,name,uniqueName } = req.body;

  console.log("registerBooking")
  console.log(req.body)

  const company = await Company.findById(req.user.companyId);
  if (!company) {
    res.status(404);
    throw new Error("company not found");
  }

  if(company.companyType === 'transporter'){
    res.status(404);
    throw new Error("its only transporter company, you cant upload do");
  }

  const newBooking = await DeliveryOrder.create({
    "companyId":company._id,
    doLink,
    name,
    uniqueName
  });

  if (newBooking) {
    res.status(201).json({
      msg: "new DO uploaded successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

const getAllDeliveryOrder = AsyncHandler(async (req, res) => {
  const companyId = req.body.companyId || req.user.companyId;
  let queryCondition = {};
  
  if (companyId) {
    queryCondition = { companyId: companyId };
  }
console.log(req.body)
console.log(req.body.status)
  if (req.body.status !== undefined) {
    console.log("heyyy")
    queryCondition.status = req.body.status;
  }
console.log(queryCondition);
  const Dos = await DeliveryOrder.find(queryCondition);
  console.log(Dos)
  const statusMapping = {
    0: 'pending',
    1: 'inqueue',
    2: 'ongoing',
    3: 'cancelled'
  };

  if (Dos) {
    const transformedDos = Dos.map(doItem => {
      const createdAtDate = new Date(doItem.createdAt);
      const uploadDate = createdAtDate.toLocaleDateString('en-GB'); // Format as dd/mm/yyyy

      return {
        _id: doItem._id,
        name: doItem.name,
        companyId: doItem.companyId,
        uniqueName: doItem.uniqueName,
        link: doItem.doLink,
        status: statusMapping[doItem.status],
        __v: doItem.__v,
        uploadDate: uploadDate // Add the formatted date as uploadDate
      };
    });

    res.status(201).json(transformedDos);
  } else {
    res.status(404);
    throw new Error("Do's not found");
  }
});

const registerBooking = AsyncHandler(async (req, res) => {
  const { partyId, truckType, rate, availableFrom,autoBooking,companyId, deliveryOrderId } = req.body;
  console.log("registerBooking")
  console.log(req.body)

  //check for already exist deliveryOrder
  const deliveryOrder = await DeliveryOrder.findById(deliveryOrderId);
  if (!deliveryOrder) {
    res.status(404);
    throw new Error("Delivery order not found");
  }

  const doBooking = await DoBooking.findOne({deliveryOrderId});
  if (doBooking) {
    res.status(409);
    throw new Error("DO Booking already created for this Delivery oder");
  }

//if autoBooking then auto allocate
  const party = await Party.findById(partyId);
  if (!party) {
    res.status(404);
    throw new Error("party not found");
  }

  const company = await Company.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error("company not found");
  }



  const newBooking = await DoBooking.create({
    partyId,
    companyId,
    truckType,
    deliveryOrderId,
    rate,
    availableFrom,
  });

  if (newBooking) {
    deliveryOrder.status = 1;
    await deliveryOrder.save();
    res.status(201).json({
      msg: "new Booking Created successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

const getDoById = AsyncHandler(async (req, res) => {
  const { doId } = req.body;
  const booking = await DOBooking.findById(doId);
  if (booking) {
    res.status(201).json(booking);
  } else {
    res.status(404);
    throw new Error("booking not found");
  }
});


///party populate
const getAllBooking = AsyncHandler(async (req, res) => {
  let queryCondition = {};
  let companyId = req.body.companyId || req.user.companyId;
  if (companyId) {
    queryCondition.companyId = companyId;
  }
  if (req.body.status) {
    queryCondition.status = req.body.status;
  }
  if (req.body.partyId) {
    queryCondition.partyId = req.body.partyId;
  }
  
  // Fetch bookings and populate 'partyId'
  const bookings = await DoBooking.find(queryCondition).populate("partyId").populate("deliveryOrderId")

  // Map over bookings to format the date
  const formattedBookings = bookings.map(booking => ({
    ...booking.toObject(),
    availableFrom: new Date(booking.availableFrom).toLocaleDateString('en-GB') // Change locale as needed
  }));

  console.log(formattedBookings);
  
  if (formattedBookings.length > 0) {
    res.status(200).json(formattedBookings);
  } else {
    res.status(404).json({ message: "Bookings not found" });
  }
});


const deleteDo = AsyncHandler(async (req, res) => {
  const { doId } = req.body;
  const booking = await DOBooking.findByIdAndDelete(doId);
  if (booking) {
    res.status(201).json(booking);
  } else {
    res.status(404);
    throw new Error("booking not found");
  }
});


const deleteDeliveryOrder = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("-------------------------------------------------------------------heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyys...")
  console.log(req.params)

  const doOrder = await DeliveryOrder.findByIdAndDelete(id);
  if (doOrder) {
    res.status(201).json(doOrder);
  } else {
    res.status(404);
    throw new Error("delivery order not found");
  }
});


export { registerBooking, getDoById, getAllBooking,deleteDo,uploadDeliveryOrder,getAllDeliveryOrder,deleteDeliveryOrder };

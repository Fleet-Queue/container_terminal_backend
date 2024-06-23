import mongoose from "mongoose";
var Schema = mongoose.Schema;

const driverSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
            return /^\d{10}$/.test(v); 
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    licenceNumber: {
        type: String,
      required: true,

    },
   
    licenceType: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },    
    status: {
      type: String,
      default:"active",
      enum: ["active", "inactive", "suspended"],
    },
  },
  {
    timestamps: true,
  }
);

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
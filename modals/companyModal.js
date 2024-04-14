import mongoose from "mongoose";

const companySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerName: {
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
    address: {
        type: String,
      required: true,

    },
    companyType: {
      type: String,
      enum: ["transporter", "forwarder", "both"],
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

const Company = mongoose.model("Company", companySchema);

export default Company;
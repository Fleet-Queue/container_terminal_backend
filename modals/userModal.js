import mongoose from "mongoose";
import bcrypt from "bcryptjs";
var Schema = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (v) {
      //       return /^\d{10}$/.test(v); 
      //   },
      //   message: (props) => `${props.value} is not a valid phone number!`,
      // },
    },
    status: {
      type: Boolean,
    },
    NoOfFailedAttempt: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["company", "admin", "superAdmin"],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    managedUserId:{
      type: Schema.Types.ObjectId,
      ref: "User", 
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;

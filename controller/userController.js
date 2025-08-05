import AsyncHandler from "express-async-handler";
import User from "../modals/userModal.js";
import Company from "../modals/companyModal.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

const registerUser = AsyncHandler(async (req, res) => {
  if (req.user?.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  const { email, name, password, phone, role, userName, address, companyId } =
    req.body;
  const status = "true";
  if (role == "company" && !companyId) {
    res.status(400);
    throw new Error("Company Id not Found");
  }
  if (role == "company") {
    const company = await Company.findById(companyId);
    if (!company) {
      res.status(400);
      throw new Error("Company not Found");
    }
  }

  const user = await User.findOne({ phone: phone });
  if (user) {
    res.status(403);
    throw new Error("user exists with same phone number");
  }
  const newUser = await User.create({
    name,
    email,
    phone,
    password,
    role,
    status,
    userName,
    companyId,
    address,
    managedUserId: req.user._id,
  });

  if (newUser) {
    const refresh = generateRefreshToken(newUser._id);
    res.cookie("jwt", refresh, { httpOnly: true, secure: true });
    res.status(201).json({
      userId: newUser._id,
      accessToken: generateAccessToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid userData");
  }
});

const authUser = AsyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ phone: phone }).populate("companyId");

  if (user && user.status) {
    if (await user.matchPassword(password)) {
      let expiresIn = "10d";
      if (user.role == "admin") {
        expiresIn = 5 * 365 * 24 * 60 * 60;
      }
      const refresh = generateRefreshToken(user._id, expiresIn);

      res.cookie("jwt", refresh, { httpOnly: true, secure: true });

      const userObj = {
        id: user._id,
        name: user.name,
        userName: user.userName,
        address: user.address,
        email: user.email,
        phone: user.phone,
        role: user.role,
        company: user.companyId || null,
      };

      res.json({
        accessToken: generateAccessToken(user._id, expiresIn),
        userId: user._id,
        user: userObj,
      });
    } else {
      res.status(403);
      throw new Error("invalid password");
    }
  } else {
    res.status(401);
    throw new Error("Invlaid user");
  }
});

const updatePassword = AsyncHandler(async (req, res) => {
  console.log(req.body);
  const password = req.body.current;
  const user = await User.findById(req.user._id);
  if (await user.matchPassword(password)) {
    console.log("matched");
    user.password = req.body.newPassword;
    user.save();
    res.status(201).json({ msg: "password reset success" });
  } else {
    res.status(403);
    throw new Error("invalid password");
  }
});

const getUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.status(201).json(user);
  } else {
    res.status(404);
    throw new Error("invalid user");
  }
});

const getAllUser = AsyncHandler(async (req, res) => {
  if (req.user?.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  const { companyId } = req.query;

  const query = { role: { $ne: "admin" } };
  if (companyId) {
    query.companyId = companyId;
  }

  const users = await User.find(query).select("-password").populate({
    path: "companyId",
    model: "Company", // Adjust if your model name is different
    select: "name", // Only get the company name
  });

  const usersWithCompanyName = users.map((user) => ({
    ...user.toObject(),
    company: user.companyId?.name || "N/A", // Just the company name
    companyId: user.companyId?._id || null, // Still keep raw companyId if needed
  }));

  res.status(200).json(usersWithCompanyName);
});

const getUserByPhone = AsyncHandler(async (req, res) => {
  const { phone } = req.body;
  const user = await User.findOne({ phone: phone }).select("-password");

  if (user) {
    res.status(201).json(user);
  } else {
    res.status(404);
    throw new Error("invalid user");
  }
});

const getUserByPhoneAndRole = AsyncHandler(async (req, res) => {
  const { phone, role } = req.body;
  const user = await User.findOne({ phone: phone, role }).select("-password");
 
  if (user) {
    res.status(201).json({data:{user_status:201}});
  } else {
    res.status(404).json({user_status:404});
    throw new Error("invalid user");
  }
});

const editUser = AsyncHandler(async (req, res) => {
  if (req.user?.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  const userId = req.params.userId || req.body.userId;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Only update allowed fields — avoid blindly updating from req.body
  const updatableFields = [
    "name",
    "userName",
    "address",
    "email",
    "phone",
    "status",
    "companyId",
  ];
  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  if (req.body.password) {
    user.password = req.body.password;
  }

  user.managedUserId = req.user._id;

  const updatedUser = await user.save();

  res.status(200).json({
    msg: "User updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      userName: updatedUser.userName,
      email: updatedUser.email,
      address: updatedUser.address,
      phone: updatedUser.phone,
      role: updatedUser.role,
      companyId: updatedUser.companyId,
    },
  });
});

const deleteUser = (req, res) => {
  if (req.user?.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  const userId = req.params.userId;

  User.findByIdAndDelete(userId)
    .then(() => {
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error deleting user", error: err });
    });
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, secure: true });

  res.json({ message: "Cookie cleared" });
};

export {
  registerUser,
  authUser,
  getUser,
  editUser,
  updatePassword,
  getUserByPhone,
  getAllUser,
  logout,
  deleteUser,
  getUserByPhoneAndRole
};

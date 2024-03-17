import AsyncHandler from "express-async-handler";
import User from "../modals/userModal.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

const registerUser = AsyncHandler(async (req, res) => {
  const { email, name, password, phone, role } = req.body;
  const status = "true";
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
  const { phone, password, role } = req.body;
  const user = await User.findOne({ phone: phone });

  if (user && user.role == role && user.status) {
    if (await user.matchPassword(password)) {
      const refresh = generateRefreshToken(user._id);

      res.cookie("jwt", refresh, { httpOnly: true, secure: true });

      res.json({
        accessToken: generateAccessToken(user._id),
        userId: user._id,
      });
    } else {
      res.status(403);
      throw new Error("invalid password");
    }
  } else {
    res.status(402);
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

const editUser = AsyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body);
  res.json({ msg: "updated" });
});

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
  logout,
};

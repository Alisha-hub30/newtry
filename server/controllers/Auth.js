import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res
        .status(401)
        .json({ success: false, message: "User already Exist" });
    }
    const hasepassword = await bcryptjs.hashSync(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hasepassword,
    });

    await newUser.save();

    res.status(200).json({ message: "user register successfully", newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const ispasswordValid = await bcryptjs.compare(password, user.password);
    if (!ispasswordValid) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRETE);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });
    res
      .status(200)
      .json({ success: true, message: "Login succesfully", user, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "user Logout successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "interanl server ereo" });
    console.log(error);
  }
};

const registerVendor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res
        .status(401)
        .json({ success: false, message: "User already Exists" });
    }
    const hashedPassword = await bcryptjs.hashSync(password, 10);
    const newVendor = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: "vendor",
    });

    await newVendor.save();

    res
      .status(200)
      .json({ message: "Vendor registered successfully", vendor: newVendor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

const CheckUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log(error);
  }
};

export { CheckUser, Login, Logout, register, registerVendor };

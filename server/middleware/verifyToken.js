import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";
const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin role required." });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const isVendor = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "vendor") {
      return res
        .status(403)
        .json({ message: "Unauthorized: User is not a vendor" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const isUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Fix: Check user.role instead of req.user.role
    if (user.role !== "user" && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. User role required.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
export { isAdmin, isUser, isVendor };

import UserModel from "../models/user.js";
import ServiceModel from "../models/service.js";

const Getuser = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Inter server error" });
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const checkAdmin = await UserModel.findById(userId);

    if (checkAdmin.role == "admin") {
      return res.status(409).json({ message: "you can not delet youselfe" });
    }
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ message: "user deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Inter server error" });
    console.log(error);
  }
};

const GetVendors = async (req, res) => {
  try {
    // Find all users with role "vendor"
    const vendors = await UserModel.find({ role: "vendor" });
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

const deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;

    // Check if the user exists and is a vendor
    const vendor = await UserModel.findById(vendorId);

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    if (vendor.role !== "vendor") {
      return res
        .status(400)
        .json({ success: false, message: "User is not a vendor" });
    }

    // Delete the vendor
    const deletedVendor = await UserModel.findByIdAndDelete(vendorId);

    res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
      vendor: deletedVendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

const updateServiceStatus = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const { status } = req.body;

    if (!["pending", "approved"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value. Only 'pending' and 'approved' are allowed." });
    }

    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    service.status = status;
    await service.save();

    res.status(200).json({ success: true, message: "Service status updated successfully", service });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

const getAllServicesForAdmin = async (req, res) => {
  try {
    const services = await ServiceModel.find().populate("vendor", "name email");
    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

export { deleteUser, deleteVendor, Getuser, GetVendors, updateServiceStatus, getAllServicesForAdmin };

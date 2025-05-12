import mongoose from "mongoose";
import BookingModel from "../models/booking.js";
import ServiceModel from "../models/service.js";
import UserModel from "../models/user.js";

const getVendorDashboard = async (req, res) => {
  try {
    // Ensure req.user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Vendor information is missing.",
      });
    }

    const vendor = req.user;

    res.status(200).json({
      success: true,
      message: "Vendor dashboard data fetched successfully",
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        role: vendor.role,
        createdAt: vendor.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log("Error in getVendorDashboard:", error);
  }
};

const updateVendorProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const vendorId = req.user._id;

    const updatedVendor = await UserModel.findByIdAndUpdate(
      vendorId,
      { name },
      { new: true }
    );

    if (!updatedVendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vendor profile updated successfully",
      vendor: {
        id: updatedVendor._id,
        name: updatedVendor.name,
        email: updatedVendor.email,
        role: updatedVendor.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

const addService = async (req, res) => {
  try {
    const {
      title,
      category,
      location,
      vendorName,
      priceType,
      basePrice,
      shortDescription,
      fullDescription,
      image,
      comesWith, // New field
    } = req.body;

    // Validate required fields
    if (!title || !category || !location || !vendorName || !priceType || !basePrice || !shortDescription || !fullDescription) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please provide all necessary information.",
      });
    }

    // Validate numeric fields
    if (isNaN(basePrice) || (priceType === "range" && isNaN(req.body.maxPrice))) {
      return res.status(400).json({
        success: false,
        message: "Invalid numeric values for price fields.",
      });
    }

    // Validate comesWith array
    if (comesWith && comesWith.length > 10) {
      return res.status(400).json({
        success: false,
        message: "You can only add up to 10 items in 'What it comes with'.",
      });
    }

    const vendorId = req.user._id;

    const newService = new ServiceModel({
      ...req.body,
      image: image || "default-service.jpg", // Use default image if none is provided
      vendor: vendorId,
      status: "pending", // Default status set to "pending"
    });

    await newService.save();

    res.status(201).json({
      success: true,
      message: "Service added successfully and is pending approval.",
      service: newService,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log("Error in addService:", error);
  }
};

const getVendorServices = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const services = await ServiceModel.find({ vendor: vendorId });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

// Update a service
const updateService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const vendorId = req.user._id;
    const updates = req.body;

    // Ensure vendor can only update their own services
    const service = await ServiceModel.findOne({
      _id: serviceId,
      vendor: vendorId,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found or you don't have permission to update it",
      });
    }

    // Validate comesWith array
    if (updates.comesWith && updates.comesWith.length > 10) {
      return res.status(400).json({
        success: false,
        message: "You can only add up to 10 items in 'What it comes with'.",
      });
    }

    const updatedService = await ServiceModel.findByIdAndUpdate(
      serviceId,
      updates,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

// Delete a service
const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const vendorId = req.user._id;

    // Ensure vendor can only delete their own services
    const service = await ServiceModel.findOne({
      _id: serviceId,
      vendor: vendorId,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found or you don't have permission to delete it",
      });
    }

    // Check if there are any active bookings for this service
    const activeBookings = await BookingModel.find({
      service: serviceId,
      status: { $in: ["pending", "confirmed"] },
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete service with active bookings",
      });
    }

    await ServiceModel.findByIdAndDelete(serviceId);

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

// Get vendor bookings
const getVendorBookings = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const bookings = await BookingModel.find({ vendor: vendorId })
      .populate("service")
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const vendorId = req.user._id;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format",
      });
    }
    // Verify the booking belongs to this vendor
    const booking = await BookingModel.findOne({
      _id: bookingId,
      vendor: vendorId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or you don't have permission to update it",
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

export {
  addService,
  deleteService,
  getVendorBookings,
  getVendorDashboard,
  getVendorServices,
  updateBookingStatus,
  updateService,
  updateVendorProfile,
};

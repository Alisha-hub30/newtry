import BookingModel from "../models/booking.js";
import ServiceModel from "../models/service.js";

// Get all available services
const getAllServices = async (req, res) => {
  try {
    let query = { isAvailable: true, status: "accepted" };

    // Allow filtering by category, price range
    const { category, minPrice, maxPrice } = req.query;

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    const services = await ServiceModel.find(query).populate(
      "vendor",
      "name email"
    );

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

// Get service details
const getServiceDetails = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const service = await ServiceModel.findById(serviceId).populate(
      "vendor",
      "name email"
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

// Book a service
const bookService = async (req, res) => {
  try {
    const { serviceId, bookingDate, notes } = req.body;
    const userId = req.user._id;

    const service = await ServiceModel.findOne({
      _id: serviceId,
      isAvailable: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found or not available",
      });
    }

    // Create the booking
    const newBooking = new BookingModel({
      service: serviceId,
      user: userId,
      vendor: service.vendor,
      bookingDate: new Date(bookingDate),
      notes,
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Service booked successfully",
      booking: newBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await BookingModel.find({ user: userId })
      .populate("service")
      .populate("vendor", "name email");

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

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id;

    // Verify the booking belongs to this user
    const booking = await BookingModel.findOne({
      _id: bookingId,
      user: userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or you don't have permission to cancel it",
      });
    }

    // Only allow cancellation of pending or confirmed bookings
    if (!["pending", "confirmed"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking with status: ${booking.status}`,
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

export {
  bookService,
  cancelBooking,
  getAllServices,
  getServiceDetails,
  getUserBookings,
};

import express from "express";
import { isVendor } from "../middleware/verifyToken.js";

import {
  addService,
  deleteService,
  getVendorBookings,
  getVendorDashboard,
  getVendorServices,
  updateBookingStatus,
  updateService,
  updateVendorProfile,
} from "../controllers/vendor.js";

const vendorRoutes = express.Router();

// Existing routes
vendorRoutes.get("/dashboard", isVendor, getVendorDashboard);
vendorRoutes.put("/profile", isVendor, updateVendorProfile);

// Service management
vendorRoutes.post("/services", isVendor, addService);
vendorRoutes.get("/services", isVendor, getVendorServices);
vendorRoutes.put("/services/:id", isVendor, updateService);
vendorRoutes.delete("/services/:id", isVendor, deleteService);

// Booking management
vendorRoutes.get("/bookings", isVendor, getVendorBookings);
vendorRoutes.put("/bookings/:id/status", isVendor, updateBookingStatus);

export default vendorRoutes;

// routes/userRoutes.js
import express from "express";
import { isUser } from "../middleware/verifyToken.js";

import {
  bookService,
  cancelBooking,
  getAllServices,
  getServiceDetails,
  getUserBookings,
} from "../controllers/user.js";

const userRoutes = express.Router();

// Public routes (no auth required)
userRoutes.get("/services", getAllServices);
userRoutes.get("/services/:id", getServiceDetails);

// Protected routes (auth required)
userRoutes.post("/book", isUser, bookService);
userRoutes.get("/bookings", isUser, getUserBookings);
userRoutes.put("/bookings/:id/cancel", isUser, cancelBooking);

export default userRoutes;

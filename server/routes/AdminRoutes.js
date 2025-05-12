import express from "express";
import {
  deleteUser,
  deleteVendor,
  Getuser,
  GetVendors,
  updateServiceStatus,
  getAllServicesForAdmin,
} from "../controllers/Admin.js";
import { isAdmin } from "../middleware/verifyToken.js";

const AdminRoutes = express.Router();
AdminRoutes.get("/getuser", isAdmin, Getuser);
AdminRoutes.get("/getvendors", isAdmin, GetVendors);
AdminRoutes.get("/getservices", isAdmin, getAllServicesForAdmin);
AdminRoutes.delete("/delete/:id", isAdmin, deleteUser);
AdminRoutes.delete("/vendor/:id", isAdmin, deleteVendor);
AdminRoutes.put("/services/:id/status", isAdmin, updateServiceStatus);

export default AdminRoutes;

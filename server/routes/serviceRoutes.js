import express from "express";
import ServiceModel from "../models/service.js";

const router = express.Router();

// Fetch all services with optional status filtering
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const services = await ServiceModel.find(query);
    res.status(200).json({ success: true, services });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Fetch a single service by ID
router.get("/:id", async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

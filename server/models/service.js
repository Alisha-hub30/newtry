import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  vendorName: { type: String, required: true },
  image: { type: String, default: "default-service.jpg" },
  shortDescription: { type: String, required: true },
  priceType: { type: String, enum: ["fixed", "starting", "range"], required: true },
  basePrice: { type: Number, required: true },
  priceUnit: { type: String, enum: ["perDay", "perEvent", "perHour", "perPerson"], required: true },
  maxPrice: { type: Number },
  discount: { type: Number },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  website: { type: String },
  socialMedia: {
    instagram: { type: String },
    facebook: { type: String },
    youtube: { type: String },
    twitter: { type: String },
  },
  fullDescription: { type: String, required: true },
  yearsInBusiness: { type: Number, required: true },
  eventsCompleted: { type: Number, required: true },
  teamSize: { type: Number },
  servicesOffered: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  portfolio: [
    {
      title: { type: String, required: true },
      images: [{ type: String, required: true }],
    },
  ],
  status: { type: String, enum: ["pending", "approved"], default: "pending" }, // Restrict status to "pending" and "approved"
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comesWith: {
    type: [String], // Array of strings
    validate: [arrayLimit, "Exceeds the limit of 10 items"], // Limit to 10 items
  },
});

function arrayLimit(val) {
  return val.length <= 10;
}

const ServiceModel = mongoose.model("Service", serviceSchema);

export default ServiceModel;

import cookieparser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import AdminRoutes from "./routes/AdminRoutes.js";
import AuthRoutes from "./routes/Auth.js";
import userRoutes from "./routes/userRoutes.js";
import vendorRoutes from "./routes/vendorRoues.js";
import serviceRoutes from "./routes/serviceRoutes.js";

import DbCon from "./utlis/db.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// mongo db
DbCon();
app.use(express.json());
app.use(cookieparser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use("/api/auth", AuthRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/user", userRoutes);
app.use("/api/services", serviceRoutes);

app.get("/", (req, res) => {
  res.send("test");
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

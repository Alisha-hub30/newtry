import express from "express";
// import { CheckUser, Login, Logout, register } from '../controllers/Auth.js'
// import {IsUser} from '../middleware/verifyToken.js'
import {
  CheckUser,
  Login,
  Logout,
  register,
  registerVendor,
} from "../controllers/Auth.js";
import { isUser } from "../middleware/verifyToken.js";
const AuthRoutes = express.Router();

AuthRoutes.post("/register", register);
AuthRoutes.post("/registerVendor", registerVendor);
AuthRoutes.post("/login", Login);
AuthRoutes.post("/logout", Logout);
AuthRoutes.get("/checkUser", isUser, CheckUser);
// AuthRoutes.post('/logout',Logout)
// AuthRoutes.get('/CheckUser',IsUser,CheckUser)

export default AuthRoutes;

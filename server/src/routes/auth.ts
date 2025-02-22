import { Hono } from "hono";
import {
  googleLogin,
  authCallback,
  signIn,
} from "../controllers/authController";

export const authRoutes = new Hono();

authRoutes.get("/google", googleLogin);
authRoutes.post("/callback", authCallback);
authRoutes.post("/signin", signIn);

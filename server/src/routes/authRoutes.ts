import express from "express";
import { AuthController } from "../controllers/authController";

const router = express.Router();
const controller = new AuthController();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

export default router;

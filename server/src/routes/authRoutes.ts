import express from "express";
import { getUsers, createUser } from "../services/userService"
import { AuthController } from "../controllers/authController";

const router = express.Router();
const controller = new AuthController();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

// router.get("/getUsers", getUsers);
// router.post("/createUser", createUser);
export default router;

import express from "express";
import { getUsers, createUser } from "../services/userService"

const router = express.Router();

router.get("/getUsers", getUsers);
router.post("/createUser", createUser);

export default router;

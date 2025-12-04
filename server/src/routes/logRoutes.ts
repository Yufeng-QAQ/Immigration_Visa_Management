import express from "express";
import { LogController } from "../controllers/logController";

const router = express.Router();
const controller = new LogController();

router.get("/getLogs", controller.getLogs);

export default router;
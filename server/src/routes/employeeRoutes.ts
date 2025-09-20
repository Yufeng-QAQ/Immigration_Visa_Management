import express from "express";
import { createEmployee, getEmployee } from "../services/employeeService";

const router = express.Router();
router.post("/createEmployee", createEmployee);
router.get("/getEmployee", getEmployee)
export default router;
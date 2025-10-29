import express from "express";
import {
  createEmployee,
  getEmployee,
  updateEmployee,
  getEmployeeById,
  deleteEmployee,
  getVisaStats,
  addComment,
  getVisaComments,
  getHistoryVisaComments
} from "../services/employeeService";
import { userAuthenticate } from "../middlewares/authMiddleware";

const router = express.Router();
router.post("/createEmployee", createEmployee);
router.get("/getEmployee", getEmployee)
router.put("/updateEmployee/:id", updateEmployee);
router.get("/getEmployeeById/:id", getEmployeeById);
router.delete("/deleteEmployee/:id", deleteEmployee);
router.get("/visaStats", getVisaStats);
router.post("/:id/comments", addComment);
router.get("/:id/comments/:visaId", getVisaComments);
router.get("/:id/history-comments", getHistoryVisaComments);

router.get("/testAuth", userAuthenticate, (req, res) => {
  res.json({ message: `Hello, ${req.session}, you're authenticated!` });
});
export default router;
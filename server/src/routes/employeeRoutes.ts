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
  getHistoryVisaComments,
  updateArchive,
  restoreEmployee,
  getEmployeeArchive,
  editComment,
  deleteComment,
  employeeUpload
} from "../services/employeeService";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();
router.post("/createEmployee", createEmployee);
router.get("/getEmployee", getEmployee);
router.put("/updateEmployee/:id", updateEmployee);
router.get("/getEmployeeById/:id", getEmployeeById);
router.delete("/deleteEmployee/:id", deleteEmployee);
router.post("/visaStats", getVisaStats);
router.post("/:id/comments", addComment);
router.get("/:id/comments/:visaId", getVisaComments);

router.get("/:id/history-comments", getHistoryVisaComments);
router.post('/archive/:id',updateArchive);
router.post('/restore/:id', restoreEmployee);
router.get("/getEmployeeArchive", getEmployeeArchive);

router.post("/comments/:id", editComment)
router.delete("/comments/:id", deleteComment);

router.post("/upload", upload.single("file"), employeeUpload);

export default router;
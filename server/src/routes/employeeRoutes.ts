import express from "express";
import Employee from "../models/employee";
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

router.delete("/deleteAll", async (req, res) => {
  try {
    // Optional: Check environment
    // if (process.env.NODE_ENV === "production") {
    //   return res.status(403).json({ message: "Not allowed in production!" });
    // }

    const result = await Employee.deleteMany({});

    res.json({
      message: "All employees deleted successfully (TEST ONLY).",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete all employees error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
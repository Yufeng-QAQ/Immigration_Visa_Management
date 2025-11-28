import { type Request, type Response } from "express";
import { VisaRecord } from "../models/visaRecord";
import Employee from "../models/employee";
import mongoose, { Schema, Document } from "mongoose";
import { Model } from "mongoose";
import {Comment} from "../models/comment";
import {IComment} from "../models/comment"
import multer from "multer";
import xlsx from "xlsx";

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const addresses = req.body.addresses?.map((item: { address: string }) => item.address) || [];
    const newEmployee = new Employee({
      ...req.body,
      addresses,
      visaHistory: []
    });
    const savedEmployee = await newEmployee.save();

    if (req.body.visaHistory) {
      const { visaType, issueDate, expireDate, status } = req.body.visaHistory[0];
      const newVisa = new VisaRecord({
        recordId: `VR-${Date.now()}`,
        employee: savedEmployee._id,
        visaType,
        issueDate,
        expireDate,
        status
      });

      const savedVisa = await newVisa.save();
      savedEmployee.visaHistory.push(savedVisa._id);
      await savedEmployee.save();
      

      if (req.body.comment) {
        const newComment = new Comment({
          record: savedVisa._id, 
          content: req.body.comment,
          date: new Date()
        });
        const savedComment = await newComment.save();
        savedEmployee.comments.push(savedComment._id);
        await savedEmployee.save();
      } else {
        console.log("No comment provided in request body.");
      }

    }

    res.status(201).json(savedEmployee);

  } catch (err: any) {
    console.error(err);
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      return res.status(400).json({ error: "Fail", details: errors });
    }
    res.status(500).json({ error: "Fail", details: err.message });
  }
};



export const getEmployee = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find({ activateStatus: true })
      .populate({
        path: "visaHistory",
        match: { status: "Active" },
        options: { sort: { issueDate: -1 }, limit: 1 }
      })
      .populate({
        path: 'comments',
        select: 'content date',
      });
      
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};




export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    
    if (Array.isArray(updateData.addresses)) {
      updateData.addresses = updateData.addresses.map(
        (item: any) => (typeof item === "string" ? item : item.address)
      );
    }

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    
    Object.assign(employee, updateData);

    const VisaModel = VisaRecord as mongoose.Model<IVisaRecord>;

    if (updateData.activeVisa) {
      const { visaType, issueDate, expireDate } = updateData.activeVisa;

      
      const currentActiveVisa = await VisaModel.findOne({
        _id: { $in: employee.visaHistory },
        status: "Active"
      });

      
      const visaTypeChanged = !currentActiveVisa || currentActiveVisa.visaType !== visaType;

      if (visaTypeChanged) {
        
        if (currentActiveVisa) {
          currentActiveVisa.status = "Expired";
          await currentActiveVisa.save();
        }

       
        const newVisa = new VisaRecord({
          recordId: `VR-${Date.now()}`,
          employee: employee._id,
          visaType,
          issueDate: new Date(issueDate),
          expireDate: new Date(expireDate),
          status: "Active"
        });

        const savedVisa = await newVisa.save();
        employee.visaHistory.push(savedVisa._id);

        
        if (updateData.newComment && updateData.newComment.trim()) {
          const newComment = new Comment({
            record: savedVisa._id,
            content: updateData.newComment.trim(),
            date: new Date(),
          });
          const savedComment = await newComment.save();
          employee.comments.push(savedComment._id);
        }
      } else {
        
        if (currentActiveVisa) {
          currentActiveVisa.set({
          issueDate: new Date(issueDate),
          expireDate: new Date(expireDate)
        });
        await currentActiveVisa.save();
        }
      }
    }

    const savedEmployee = await employee.save();
    res.json({ message: "Employee updated", employee: savedEmployee });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};


export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;  // employeeId
    const { visaId, content } = req.body;

    if (!content?.trim()) return res.status(400).json({ error: "Comment cannot be empty" });
    if (!visaId) return res.status(400).json({ error: "Visa ID is required" });

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const newComment = new Comment({
      record: visaId,
      content: content.trim(),
      date: new Date(),
    });

    const savedComment = await newComment.save();
    employee.comments.push(savedComment._id);
    await employee.save();

    res.json({ message: "Comment added", comment: savedComment });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

export const getVisaComments = async (req: Request, res: Response) => {
  try {
    const { id, visaId } = req.params;

    
    const employee = await Employee.findById(id);
    const CommentModel = Comment as mongoose.Model<IComment>;
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    
    const comments = await CommentModel.find({
  _id: { $in: employee.comments },
  record: visaId
}).sort({ date: 1 });

console.log("Fetched comments:", comments);

    res.json({ comments });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};  

export const getHistoryVisaComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // 员工 ID
    const CommentModel = Comment as mongoose.Model<IComment>;
    const VisaModel = VisaRecord as mongoose.Model<IVisaRecord>;

    
    const expiredVisas = await VisaModel.find({
      employee: id,
      status: { $ne: "Active" },
    }).lean();

    const visaIds = expiredVisas.map(v => v._id);

    
    const comments = await CommentModel.find({
      record: { $in: visaIds },
    })
      .sort({ date: 1 })
      .lean();

    
const groupedComments: Record<string, IComment[]> = {};
expiredVisas.forEach(v => {
  groupedComments[v._id.toString()] = comments.filter(
    c => c.record.toString() === v._id.toString()
  );
});


const history = expiredVisas.map(v => ({
  visaId: v._id.toString(),
  visaType: v.visaType,
  status: v.status,
  comments: groupedComments[v._id.toString()] || []
}));

res.json({ history });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};





export const getVisaStats = async (req: Request, res: Response) => {
  try {
    const result = await VisaRecord.aggregate([
      { $match: { status: "Active" } }, 
      {
        $addFields: {
          daysToExpire: {
            $ceil: {
              $divide: [
                { $subtract: ["$expireDate", "$$NOW"] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: "$visaType",
          total: { $sum: 1 },
          urgentRed: {
            $sum: { $cond: [{ $lte: ["$daysToExpire", 30] }, 1, 0] }
          },
          urgentYellow: {
            $sum: { $cond: [{ $and: [{ $gt: ["$daysToExpire", 30] }, { $lte: ["$daysToExpire", 60] }] }, 1, 0] }
          },
          urgentBlue: {
            $sum: { $cond: [{ $and: [{ $gt: ["$daysToExpire", 60] }, { $lte: ["$daysToExpire", 90] }] }, 1, 0] }
          }
        }
      }
    ]);

    const visaCount: Record<string, number> = {};
    let urgentRed = 0, urgentYellow = 0, urgentBlue = 0;

    result.forEach((r: any) => {
      visaCount[r._id] = r.total;
      urgentRed += r.urgentRed;
      urgentYellow += r.urgentYellow;
      urgentBlue += r.urgentBlue;
    });

    res.json({
      visaCount,
      urgent: {
        red: urgentRed,
        yellow: urgentYellow,
        blue: urgentBlue
      }
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};


export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate({
        path: "visaHistory",
        match: { status: "Active" },
        options: { sort: { issueDate: -1 }, limit: 1 }
      })
      .populate({
      path: "comments",
      select: "content date"
      });

    if (!employee) return res.status(404).json({ error: "Employee not found" });


    const activeVisa = employee.visaHistory && employee.visaHistory.length > 0
      ? employee.visaHistory[0]
      : { visaType: "", issueDate: null, expireDate: null, status: "Active" };


    const result = {
      ...employee.toObject(),
      activeVisa,
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


export interface IVisaRecord {
  visaType: string;
  startDate: Date;
  expireDate: Date;
  status: "Active" | "Expired" | "Pending";
}

export const addVisa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const visa: IVisaRecord = {
      visaType: req.body.visaType,
      startDate: new Date(req.body.startDate),
      expireDate: new Date(req.body.expireDate),
      status: req.body.status || "Pending"
    };

    const employee = await Employee.findByIdAndUpdate(
      id,
      { $push: { visaHistory: visa } },
      { new: true }
    );

    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Visa added", employee });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const VisaModel = VisaRecord as mongoose.Model<IVisaRecord>;
    // Validate if visaRecord exist
    if (employee.visaHistory && employee.visaHistory.length > 0) {
      await VisaModel.deleteMany({
        _id: { $in: employee.visaHistory },
      });
    }

    const deleted = await Employee.findByIdAndDelete(id);

    res.json({
      message: "Employee and related active visa records deleted successfully",
      deleted
    });

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};



export const updateArchive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { activateStatus: false },   
      { new: true }               
    );


    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee archived successfully",
      employee: updatedEmployee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to archive employee" });
  }
};


export const restoreEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { activateStatus: true },   
      { new: true }               
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee restored successfully",
      employee: updatedEmployee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to restore employee" });
  }
};

export const getEmployeeArchive = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find({ activateStatus: false })
      .populate({
        path: "visaHistory",
        match: { status: "Active" },
        options: { sort: { issueDate: -1 }, limit: 1 }
      })
      .populate({
        path: 'comments',
        select: 'content date',
      });
    
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const editComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;        // URL 里的 comment id
    const { content } = req.body;     // POST 请求 body 里的新内容

    const CommentModel = Comment as mongoose.Model<IComment>;
    

    // 更新数据库
    const updatedComment = await CommentModel.findByIdAndUpdate(
      id,
      { content },
      { new: true } 
    );

    if (!updatedComment) return res.status(404).json({ error: "Comment not found" });

    res.json({ comment: updatedComment });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};


export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const CommentModel = Comment as mongoose.Model<IComment>;

    const deletedComment = await CommentModel.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json({ message: "Comment deleted successfully", comment: deletedComment });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

const upload = multer({ dest: "uploads/" });

const parseExcelDate = (value: any): Date | null => {
  if (!value) return null;

  // 1) 清理掉 "done8/22/2022" 这种格式
  if (typeof value === "string") {
    const trimmed = value.trim();

    // 忽略无效字符
    if (trimmed === "" || ["?", "-", "N/A", "n/a", "na"].includes(trimmed)) {
      return null;
    }

    // 提取真正的 MM/DD/YYYY
    const match = trimmed.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/);
    if (match) {
      const dateStr = match[0];
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? null : d;
    }

    // 如果是纯字符串但不是日期，不解析
    return null;
  }

  // 2) 如果是数字 → Excel 日期序列号
  if (typeof value === "number" && !isNaN(value)) {
    return new Date((value - 25569) * 86400 * 1000);
  }

  return null;
};




function removeEmptyFields(obj: Record<string, any>) {
  const clean: Record<string, any> = {};
  
  for (const key in obj) {
    const value = obj[key];

    // 条件：只保留真正的有效值
    const isValid =
      value !== null &&
      value !== undefined &&
      !(typeof value === "string" && value.trim() === "") &&
      value !== "?" &&
      !(typeof value === "number" && isNaN(value));

    if (isValid) {
      clean[key] = value;
    }
  }

  return clean;
}

export const employeeUpload = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded.");

  try {
    const workbook = xlsx.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]!];
    if (!sheet) return res.status(400).send("Sheet not found");

    const rows = xlsx.utils.sheet_to_json<Record<string, any>>(sheet);
    let createdCount = 0;
    let updatedCount = 0;
    let visaCount = 0;

    for (const row of rows.slice(0, 5)) {
      if (!row["Last name"] || !row["First Name"]) continue;

      // 1️⃣ 查找员工
      const query = {
        lastName: row["Last name"],
        firstName: row["First Name"],
      };

      // 2️⃣ Employee 更新字段（只包含 profile，不含签证）
      const employeeUpdateRaw: Record<string, any> = {
        email: row["Employee's UMBC email"] ?? null,
        personalEmail: row["Personal email"] ?? null,
        countryOfBirth: row["Country of Birth"] ?? null,
        allCitizenship: row["All Citizenships"] ? [row["All Citizenships"]] : undefined,
        gender: row["Gender"] ?? null,

        dependents: row["Dependents"] ? Number(row["Dependents"]) : null,

        // 签证相关字段（属于员工）
        initialH1BStart: parseExcelDate(row["initial H-1B start"]),
        prepExtensionDate: parseExcelDate(row["Prep extension date"]),
        maxHPeriod: parseExcelDate(row["Max H period"]),
        documentExpiryI94: parseExcelDate(row["Document Expiry I-94"]),

        socCode: row["soc code"] ?? null,
        socCodeDescription: row["soc code description"] ?? null,

        salary: row["Annual Salary"] ?? null,
        positionTitle: row["Employee Title"] ?? null,

        highestDegree: row["Employee Educational  Level"] ?? null,
        employeeEducationalField: row["Employee Educational Field"] ?? null,
        permanentResidencyNotes: row["Permanent residency notes"] ?? null,

        departmentInfo: {
          college: "UMBC",
          department: row["Department"] ?? undefined,
          supervisor: row["Department Advisor/PI/chair"] ?? undefined,
          admin: row["Department Admin"] ?? undefined,
        },
      };

      // 清理空字段
      const employeeUpdate = removeEmptyFields(employeeUpdateRaw);
      
      let employee = await Employee.findOne(query);
      
      if (!employee) {
        employeeUpdate.employeeId = `EMP-${row["First Name"]}-${row["Last name"]}-${Date.now()}`;
      }
            // 3️⃣ Upsert Employee
      employee! = await Employee.findOneAndUpdate(query, employeeUpdate, {
        upsert: true,
        new: true,
      });

      if (employee!.isNew) createdCount++;
      else updatedCount++;

      // 4️⃣ 创建 VisaRecord 数据
      const visaUpdateRaw = {
        recordId: `VR-${Date.now()}`,
        employee: employee._id,
        visaType: row["Case type"] ?? null,
        issueDate: parseExcelDate(row["Start date"]),
        expireDate: parseExcelDate(row["Expiration Date"]),
        status: "Active",
      };

      const visaData = removeEmptyFields(visaUpdateRaw);

      // 如果 caseType 为空，跳过
      if (!visaData.visaType) continue;

      
      const VisaModel = VisaRecord as mongoose.Model<IVisaRecord>;

      let existingVisa = await VisaModel.findOne({
        employee: employee._id,
        visaType: visaData.visaType,
      });

      if (!existingVisa) {
        // 1) 将旧的 active case 全部设置为 expired
        await VisaRecord.updateMany(
            { employee: employee._id, status: "Active" },
            { $set: { status: "Expired" } }
        );

        // 2) 创建新的签证记录
        const visaRecord = new VisaRecord(visaData);
        const savedVisa = await visaRecord.save();

        // 3) push 新的签证到 employee.visaHistory
        employee.visaHistory.push(savedVisa._id);
        await employee.save();

        visaCount++;

        if (employeeUpdateRaw.permanentResidencyNotes) {
          const newComment = new Comment({
            record: savedVisa._id,
            content: employeeUpdateRaw.permanentResidencyNotes,
            date: new Date()
          });

          const savedComment = await newComment.save();
          employee.comments.push(savedComment._id);
          await employee.save();
        }

      } else {
          console.log(`Visa type "${visaData.visaType}" already exists. Skipping.`);
      }

    }

    return res.json({
      message: "Import Complete",
      employeesCreated: createdCount,
      employeesUpdated: updatedCount,
      visaRecordsCreated: visaCount,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).send("Error processing Excel file.");
  }
};


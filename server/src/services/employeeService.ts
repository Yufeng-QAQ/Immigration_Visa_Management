import { type Request, type Response } from "express";
import { VisaRecord } from "../models/visaRecord";
import Employee from "../models/employee";
import mongoose, { Schema, Document } from "mongoose";
import { Model } from "mongoose";
import {Comment} from "../models/comment";
import {IComment} from "../models/comment"

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const addresses = req.body.addresses?.map((item: { address: string }) => item.address) || [];
    const newEmployee = new Employee({
      ...req.body,
      addresses,
      visaHistory: []
    });
    const savedEmployee = await newEmployee.save();

    if (req.body.activeVisa) {
      const { visaType, issueDate, expireDate, status } = req.body.activeVisa;
      console.log("Creating VisaRecord with:", { visaType, issueDate, expireDate, status });
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
        console.log("Creating Comment for visa:", savedVisa._id, "with content:", req.body.comment);
        const newComment = new Comment({
          record: savedVisa._id, 
          content: req.body.comment,
          date: new Date()
        });
        const savedComment = await newComment.save();
        console.log("Saved Comment:", savedComment);
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
    const employees = await Employee.find()
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

    console.log("employee.comments:", employee.comments); 
    console.log("visaId:", visaId); 
    console.log("found comments:", comments); 

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
      console.log("Populated comments:", employee?.comments);


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

    await VisaModel.deleteMany({
      _id: { $in: employee.visaHistory },
      status: "Active"
    });

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




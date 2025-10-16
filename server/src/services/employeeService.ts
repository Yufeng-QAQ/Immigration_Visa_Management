import { type Request, type Response } from "express";
import { VisaRecord } from "../models/visaRecord";
import Employee from "../models/employee";
import mongoose, { Schema, Document } from "mongoose";


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

// const API = 'http://localhost:8000/api/employee/createEmployee'

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find()
      .populate({
        path: "visaHistory",
        match: { status: "Active" },
        options: { sort: { issueDate: -1 }, limit: 1 }
      });
    // console.log("即将返回给前端的 employees:", JSON.stringify(employees, null, 2));
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// export const updateEmployee = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

    
//     if (updateData.dateOfBirth) {
//       updateData.dateOfBirth = new Date(updateData.dateOfBirth);
//     }

   
//     if (Array.isArray(updateData.addresses)) {
//       updateData.addresses = updateData.addresses.map(
//         (item: any) => (typeof item === "string" ? item : item.address)
//       );
//     }


//     const employee = await Employee.findById(id);
//     if (!employee) return res.status(404).json({ error: "Employee not found" });


//     Object.assign(employee, updateData);


//     if (updateData.activeVisa) {
//       const { visaType, issueDate, expireDate, status } = updateData.activeVisa;

      
//       const newVisa = new VisaRecord({
//         recordId: `VR-${Date.now()}`,
//         employee: employee._id,
//         visaType,
//         issueDate,
//         expireDate,
//         status
//       });
//       const savedVisa = await newVisa.save();

      
//       if (employee.visaHistory.length > 0) {
//         employee.visaHistory[employee.visaHistory.length - 1] = savedVisa._id;
//       } else {
//         employee.visaHistory.push(savedVisa._id);
//       }
//     }

  
//     const savedEmployee = await employee.save();

//     res.json({ message: "Employee updated", employee: savedEmployee });
//   } catch (err: any) {
//     console.error(err);
//     res.status(500).json({ error: err.message || "Server error" });
//   }
// };

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

    
    if (updateData.activeVisa) {
      const { visaType, issueDate, expireDate } = updateData.activeVisa;

      
      await VisaRecord.updateMany(
        { _id: { $in: employee.visaHistory }, status: "Active" },
        { $set: { status: "Inactive" } }
      );

      
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
    }

    const savedEmployee = await employee.save();

    res.json({ message: "Employee updated", employee: savedEmployee });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}



export const getVisaStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    
    const result = await VisaRecord.aggregate([
      { $match: { status: "Active" } }, 
      {
        $addFields: {
          daysToExpire: {
            $ceil: {
              $divide: [
                { $subtract: ["$expireDate", today] },
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
      });

    if (!employee) return res.status(404).json({ error: "Employee not found" });


    const activeVisa = employee.visaHistory && employee.visaHistory.length > 0
      ? employee.visaHistory[0]
      : { visaType: "", issueDate: null, expireDate: null, status: "Active" };


    const result = {
      ...employee.toObject(),
      activeVisa,
    };

    // console.log("返回数据:", JSON.stringify(result, null, 2));
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
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully", deleted });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};



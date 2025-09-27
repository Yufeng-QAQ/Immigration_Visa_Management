import {Employee} from "../models/employee";
import { response, type Request, type Response } from "express";
import axios from "axios";
import {Department} from "../models/department";
import { Types } from "mongoose";
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

import { VisaRecord } from "../models/visaRecord";

 interface TaskItemCreate {
  employeeId?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;  
  email: string;
  addresses: Address[];
  salary: number;
  positionTitle: string;
  highestDegree: string;
  department: string;
  visaHistory: string[];
  activateStatus: boolean;
}


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






const API = 'http://localhost:8000/api/employee/createEmployee'

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find()
      .populate({
        path: "visaHistory",
        match: { status: "Active" },            
        options: { sort: { issueDate: -1 }, limit: 1 } 
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

    //?>?
    if (updateData.dateOfBirth) updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    if (updateData.visaHistory) {
      updateData.visaHistory = updateData.visaHistory.map((v: any) => ({
        ...v,
        startDate: new Date(v.startDate),
        expireDate: new Date(v.expireDate)
      }));
    }

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    
    Object.assign(employee, updateData);

    
    const saved = await employee.save();
    res.json({ message: "Employee updated", employee: saved });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};



export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    
    if (!employee) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    
    res.json(employee);
  } catch (err) {
    console.error("error:", err);
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
  } catch(err: any) {
    res.status(500).json({ message: err.message });
  }
};
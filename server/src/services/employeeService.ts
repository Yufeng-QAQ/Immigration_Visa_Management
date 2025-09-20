import Employee from "../models/employee";
import type { Request, Response } from "express";



export const createEmployee = async (req: Request, res: Response) => {
  try {
    console.log("请求体:", req.body);  // 
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    console.error("创建员工失败:", err);
    res.status(500).json({ error: "创建员工失败", details: err });
  }
};




export const getEmployee = async (req: Request, res:Response) => {
  try{
    const employee= await Employee.find();
    res.json(employee);
    
  } catch (err){
    res.status(500).json({ error: "Server error" });
  }
}
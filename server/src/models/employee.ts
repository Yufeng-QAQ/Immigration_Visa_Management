// import mongoose, { Schema, Document, Model, Types } from "mongoose";

// export interface IEmployee extends Document {
//   employeeId: string;
//   firstName: string;
//   lastName: string;
//   middleName?: string;
//   dateOfBirth: Date;
//   email: string;
//   addresses: {
//     street: string;
//     city: string;
//     state: string;
//     zip: string;
//     country: string;
//   }[];
//   salary: number;
//   positionTitle: string;
//   highestDegree: string;
//   department: Types.ObjectId;
//   visaHistory: Types.ObjectId[];
//   activateStatus: boolean;
// }

// const EmployeeSchema: Schema = new Schema({
//   employeeId: { type: String, required: true, unique: true },
//   firstName: { type: String, required: true },
//   middleName: String,
//   lastName: { type: String, required: true },
//   dateOfBirth: { type: Date, required: true },
//   email: { type: String, required: true },
//   addresses: [
//     {
//       street: String,
//       city: String,
//       state: String,
//       zip: String,
//       country: String
//     }
//   ],
//   salary: Number,
//   positionTitle: String,
//   highestDegree: String,
//   department: { type: Schema.Types.ObjectId, ref: "Department" },
//   visaHistory: [
//     {
//       visaType: String,
//       startDate: Date,
//       expireDate: Date,
//     },
//   ],
//   activateStatus: { type: Boolean, default: true },
// }, {
//   timestamps: true
// });

// // 方法1：直接导出模型
// export default mongoose.model<IEmployee>("Employee", EmployeeSchema);

// Employee.ts
import { Schema, model } from "mongoose";

const DepartmentSchema = new Schema({
  collegeName: { type: String, required: true },
  departmentName: { type: String, required: true },
  supervisor: String,
  admin: String,
});

const VisaSchema = new Schema({
  visaType: String,
  validPeriod: {
    startDate: Date,
    expireDate: Date,
  },
});

const EmployeeSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: Date,
  email: { type: String, required: true },
  department: DepartmentSchema, // 嵌套对象
  visaHistory: [VisaSchema],
  addresses: [{
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  }],
  activateStatus: { type: Boolean, default: true },
  salary: Number,
  positionTitle: String,
  highestDegree: String,
});

export const Employee = model("Employee", EmployeeSchema);
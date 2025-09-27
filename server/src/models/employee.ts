import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDepartmentInfoItem {
  college: string;
  department: string;
  supervisor: string;
  admin?: string;
}

export interface AddressItem {
  address: string;
}

export interface IEmployee {
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  email: string;
  addresses: AddressItem[];
  salary: number;
  positionTitle: string;
  highestDegree: string;
  departmentInfo: IDepartmentInfoItem;
  visaHistory: mongoose.Types.ObjectId[];
  activateStatus: boolean;
}

const AddressSchema = new Schema<AddressItem>({
  address: { type: String, required: true }
});

// 让 Schema 知道是 IEmployee
const EmployeeSchema: Schema<IEmployee> = new Schema({
  employeeId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  middleName: String,
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true },
  addresses: [AddressSchema],
  salary: Number,
  positionTitle: String,
  highestDegree: String,
  departmentInfo: {
    college: { type: String, required: true },
    department: { type: String, required: true },
    supervisor: { type: String, required: true },
    admin: { type: String },
  },
  visaHistory: [{ type: Schema.Types.ObjectId, ref: "VisaRecord" }],
  activateStatus: { type: Boolean, default: true },
});

// 正确声明 Model 类型
export const Employee: Model<IEmployee> =
  mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema);

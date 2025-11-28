import mongoose, { Schema, Document } from "mongoose";

export interface IDepartmentInfoItem extends Document {
  college: string;
  department: string;
  supervisor: string;
  admin?: string;
}

export interface IEmployee extends Document {
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  email: string;
  
  personalEmail: string;
  allCitizenship: string[];
  gender:boolean;
  dependents: number;
  initialH1BStart : Date;
  startDate: Date;
  expirationDate: Date;
  prepExtensionDate: Date;
  maxHPeriod: Date;
  documentExpiryI94: Date;
  socCode:string;
  socCodeDescription: string;
  employeeEducationalField:string;
  permanentResidencyNotes:string;

  countryOfBirth: string;
  addresses: string[];
  salary: number;
  positionTitle: string;
  highestDegree: string;
  departmentInfo: IDepartmentInfoItem;
  visaHistory: mongoose.Types.ObjectId[];
  activateStatus: boolean;
  comments: mongoose.Types.ObjectId[];
}



const EmployeeSchema: Schema = new Schema({
  employeeId: { type: String, require: true, unique: true },
  firstName: { type: String, required: true },
  middleName: String,
  lastName: { type: String, required: false },
  countryOfBirth: {type: String},
  dateOfBirth: { type: Date, required: false },
  email: { type: String, required: false },

  personalEmail: String,
  allCitizenship: [{ type: String }],
  gender: Boolean,
  dependents: Number,
  initialH1BStart : Date,
  prepExtensionDate: Date,
  maxHPeriod: Date,
  startDate: Date,
  expirationDate: Date,
  documentExpiryI94: Date,
  socCode: String,
  socCodeDescription: String,
  employeeEducationalField: String,
  addresses: [{ type: String }],
  salary: Number,
  positionTitle: String,
  highestDegree: String,
  permanentResidencyNotes: String,


  departmentInfo: {
    college: { type: String, required: false },
    department: { type: String, required: false },
    supervisor: { type: String, required: false },
    admin: { type: String },
  },
  visaHistory: [{ type: Schema.Types.ObjectId, ref: "VisaRecord" }],
  activateStatus: { type: Boolean, default: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

export default mongoose.model<IEmployee>("Employee", EmployeeSchema);
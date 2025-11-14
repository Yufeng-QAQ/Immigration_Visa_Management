export interface AddressItem {
  address: string;
}

export interface ActiveVisaItem {
  _id?: string;
  visaType: string;
  issueDate: Date | null;
  expireDate: Date | null;
  status: "Active" | "Expired" | "Pending";
}

interface DepartmentInfoItem {
  college: string;
  department: string;
  supervisor: string;
  admin?: string;
}

export interface Department {
  _id: string;
  collegeName: string;
  departmentName: string;
  supervisor?: string;
  admin?: string;
}

export interface EmployeeItem {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date | null;
  email: string;
  addresses: AddressItem[];
  countryOfBirth: string;
  salary: number;
  positionTitle: string;
  highestDegree: string;
  departmentInfo: DepartmentInfoItem;
  visaHistory: ActiveVisaItem[];
  activateStatus: boolean;
  comment: string;
}
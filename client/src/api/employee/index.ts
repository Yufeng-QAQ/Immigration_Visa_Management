interface AddressItem {
  address: string;
}

interface ActiveVisaItem {
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

export interface EmployeeItem {
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date | null;
  email: string;
  addresses: AddressItem[];
  salary: number;
  positionTitle: string;
  highestDegree: string;
  departmentInfo: DepartmentInfoItem;
  activeVisa: ActiveVisaItem;
  activateStatus: boolean;
}
interface AddressItem {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
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
  department: string; // 假设前端用下拉选择部门 id
  activateStatus: boolean;
}
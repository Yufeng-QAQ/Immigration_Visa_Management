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
  addresses: string[];
  salary: number;
  positionTitle: string;
  highestDegree: string;
  department: string;   // Not yet decided
  activateStatus: boolean;
}
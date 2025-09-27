export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface TaskItemCreate {
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


export interface Employee {
  id?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  hireDate?: string;
  salary?: number;
  department?: Department;
  isActive?: boolean;
}

export enum Department {
  HR = 0,
  IT = 1,
  Finance = 2,
}

import { Mapper } from '../../../Common/infrastructure/mapper';
import { Department, Employee } from '../../Employee.Domain/employee';

export interface EmployeeDto {
  id?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  hireDate?: string;
  salary?: number;
  department?: Department;
  isActive?: boolean;
}

export class EmployeeMapper extends Mapper<EmployeeDto, Employee> {
  mapFrom(param: EmployeeDto): Employee {
    return {
      id: param.id,
      fullName: param.fullName,
      email: param.email,
      phone: param.phone,
      hireDate: param.hireDate,
      salary: param.salary,
      department: param.department,
      isActive: param.isActive,
    };
  }

  mapTo(param: Employee): EmployeeDto {
    return {};
  }

  public static Map(): EmployeeMapper {
    return new EmployeeMapper();
  }
}

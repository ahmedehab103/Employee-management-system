import { Observable } from 'rxjs';
import { Department, DepartmentOption, Employee } from '../Employee.Domain/employee';
import { EmployeeImplementationRepository } from '../Employee.Infrastructure/repositories/employee-implementation-repository';
import {
  PaginationParams,
  PaginationRespons,
} from '../../Common/domain/pagination';

export abstract class EmployeeRepository {
  abstract getDepartments(): Observable<DepartmentOption[]>;

  abstract getPage(
    params: PaginationParams,
    department?: Department
  ): Observable<PaginationRespons<Employee>>;

  abstract post(employee: Employee): Observable<number>;

  abstract put(employee: Employee): Observable<object>;

  abstract delete(id: number): Observable<object>;
}

export const employeeRepositoryProvider = {
  provide: EmployeeRepository,
  useClass: EmployeeImplementationRepository,
};

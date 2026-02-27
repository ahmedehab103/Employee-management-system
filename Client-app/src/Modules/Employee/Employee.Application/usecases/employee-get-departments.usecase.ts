import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutInPut } from '../../../Common/application/use-case';
import { DepartmentOption } from '../../Employee.Domain/employee';
import { EmployeeRepository, employeeRepositoryProvider } from '../employee.repository';

@Injectable()
class EmployeeGetDepartmentsUseCase implements UseCaseWithOutInPut<DepartmentOption[]> {
  private readonly employeeRepository = inject(EmployeeRepository);

  execute(): Observable<DepartmentOption[]> {
    return this.employeeRepository.getDepartments();
  }
}

const EmployeeGetDepartmentsProviders = [employeeRepositoryProvider, EmployeeGetDepartmentsUseCase];
export { EmployeeGetDepartmentsUseCase, EmployeeGetDepartmentsProviders };

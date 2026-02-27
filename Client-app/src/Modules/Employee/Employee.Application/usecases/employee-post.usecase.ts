import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../Common/application/use-case';
import { Employee } from '../../Employee.Domain/employee';
import { EmployeeRepository, employeeRepositoryProvider } from '../employee.repository';

@Injectable()
class EmployeePostUseCase implements UseCase<Employee, number> {
  private readonly employeeRepository = inject(EmployeeRepository);

  execute(employee: Employee): Observable<number> {
    return this.employeeRepository.post(employee);
  }
}

const EmployeePostProviders = [employeeRepositoryProvider, EmployeePostUseCase];
export { EmployeePostUseCase, EmployeePostProviders };

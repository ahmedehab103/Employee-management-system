import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutOutPut } from '../../../Common/application/use-case';
import { Employee } from '../../Employee.Domain/employee';
import { EmployeeRepository, employeeRepositoryProvider } from '../employee.repository';

@Injectable()
class EmployeePutUseCase implements UseCaseWithOutOutPut<Employee> {
  private readonly employeeRepository = inject(EmployeeRepository);

  execute(employee: Employee): Observable<object> {
    return this.employeeRepository.put(employee);
  }
}

const EmployeePutProviders = [employeeRepositoryProvider, EmployeePutUseCase];
export { EmployeePutUseCase, EmployeePutProviders };

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCase } from '../../../Common/application/use-case';
import { PaginationParams, PaginationRespons } from '../../../Common/domain/pagination';
import { Department, Employee } from '../../Employee.Domain/employee';
import { EmployeeRepository, employeeRepositoryProvider } from '../employee.repository';

@Injectable()
class EmployeeGetPageUseCase
  implements
    UseCase<
      { params: PaginationParams; department?: Department },
      PaginationRespons<Employee>
    >
{
  private readonly employeeRepository = inject(EmployeeRepository);

  execute(data: {
    params: PaginationParams;
    department?: Department;
  }): Observable<PaginationRespons<Employee>> {
    return this.employeeRepository.getPage(data.params, data.department);
  }
}

const EmployeeGetPageProviders = [employeeRepositoryProvider, EmployeeGetPageUseCase];
export { EmployeeGetPageUseCase, EmployeeGetPageProviders };

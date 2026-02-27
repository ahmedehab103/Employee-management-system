import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UseCaseWithOutOutPut } from '../../../Common/application/use-case';
import { EmployeeRepository, employeeRepositoryProvider } from '../employee.repository';

@Injectable()
class EmployeeDeleteUseCase implements UseCaseWithOutOutPut<number> {
  private readonly employeeRepository = inject(EmployeeRepository);

  execute(id: number): Observable<object> {
    return this.employeeRepository.delete(id);
  }
}

const EmployeeDeleteProviders = [employeeRepositoryProvider, EmployeeDeleteUseCase];
export { EmployeeDeleteUseCase, EmployeeDeleteProviders };

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EmployeeRepository } from '../../Employee.Application/employee.repository';
import { Department, Employee } from '../../Employee.Domain/employee';
import { environment } from '../../../../environments/environment';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../Common/domain/pagination';
import { EmployeeDto, EmployeeMapper } from '../models/employee.model';

@Injectable()
export class EmployeeImplementationRepository implements EmployeeRepository {
  private readonly _httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/v1/AdminPanel/Employee`;

  getPage(
    params: PaginationParams,
    department?: Department
  ): Observable<PaginationRespons<Employee>> {
    const queryParams: any = {
      offset: params.offset ?? 0,
      pageIndex: params.pageIndex,
      search: params.search ?? '',
      ascending: params.ascending ?? true,
      sortBy: params.sortBy ?? '',
    };

    if (department !== undefined && department !== null) {
      queryParams['department'] = department;
    }

    return this._httpClient
      .get(`${this.baseUrl}/GetPage`, { params: queryParams })
      .pipe(
        map((data) => {
          const response = data as PaginationRespons<EmployeeDto>;
          const items: Employee[] = response.items.map((e) =>
            EmployeeMapper.Map().mapFrom(e)
          );
          return { pageInfo: response.pageInfo, items };
        })
      );
  }

  post(employee: Employee): Observable<number> {
    return this._httpClient
      .post(`${this.baseUrl}/PostEmployee`, {
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        hireDate: employee.hireDate,
        salary: employee.salary,
        department: employee.department,
      })
      .pipe(map((data) => data as number));
  }

  put(employee: Employee): Observable<object> {
    return this._httpClient.put(`${this.baseUrl}/PutEmployee`, {
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      hireDate: employee.hireDate,
      salary: employee.salary,
      department: employee.department,
      isActive: employee.isActive,
    });
  }

  delete(id: number): Observable<object> {
    return this._httpClient.delete(
      `${this.baseUrl}/DeleteEmployee/${id}`
    );
  }
}

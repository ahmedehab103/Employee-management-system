import { Toast } from 'primeng/toast';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PaginationParams, PaginationRespons } from '../../../Common/domain/pagination';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroup } from 'primeng/inputgroup';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TableComponent } from '../../../Common/presentation/tableComponent';
import { Department, Employee } from '../../Employee.Domain/employee';
import {
  EmployeeGetPageProviders,
  EmployeeGetPageUseCase,
} from '../../Employee.Application/usecases/employee-get-page.usecase';
import {
  EmployeeDeleteProviders,
  EmployeeDeleteUseCase,
} from '../../Employee.Application/usecases/employee-delete.usecase';
import { CreateUpdateEmployeeComponent } from './create-update-employee/create-update-employee.component';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    SelectModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    Toast,
    InputGroupAddonModule,
    InputGroup,
    PaginatorModule,
    ConfirmDialog,
    DatePipe,
    DecimalPipe,
  ],
  providers: [
    EmployeeGetPageProviders,
    EmployeeDeleteProviders,
    DialogService,
    MessageService,
    ConfirmationService,
  ],
})
export class EmployeesListComponent implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly employeeGetPageUseCase = inject(EmployeeGetPageUseCase);
  private readonly employeeDeleteUseCase = inject(EmployeeDeleteUseCase);

  public selectedDepartment: Department | null = null;

  public searchQuery: { data: string } = { data: '' };

  public pagesData: { data?: PaginationRespons<Employee> } = { data: undefined };

  // Arrow function declared before `table` so `this.getData` is defined when table is constructed
  getData = (
    params: PaginationParams,
    usecase: EmployeeGetPageUseCase = this.employeeGetPageUseCase
  ) => {
    usecase
      .execute({
        params,
        department: this.selectedDepartment ?? undefined,
      })
      .subscribe((data) => {
        this.pagesData.data = data;
      });
  };

  public readonly table: TableComponent<Employee> = new TableComponent(
    this.translateService,
    this.dialogService,
    this.messageService,
    this.confirmationService,
    this.getData,
    this.searchQuery,
    this.employeeGetPageUseCase,
    this.pagesData
  );

  public readonly departmentOptions = signal([
    { label: this.translateService.instant('employees.all_departments'), value: null },
    { label: this.translateService.instant('employees.hr'), value: Department.HR },
    { label: this.translateService.instant('employees.it'), value: Department.IT },
    { label: this.translateService.instant('employees.finance'), value: Department.Finance },
  ]);

  public readonly columns = signal<any[]>([
    { name: this.translateService.instant('employees.full_name'), field: 'fullName' },
    { name: this.translateService.instant('employees.email'), field: 'email' },
    { name: this.translateService.instant('employees.phone'), field: 'phone' },
    { name: this.translateService.instant('employees.hire_date'), field: 'hireDate' },
    { name: this.translateService.instant('employees.department'), field: 'department' },
    { name: this.translateService.instant('employees.salary'), field: 'salary' },
    { name: this.translateService.instant('employees.is_active'), field: 'isActive' },
    { name: this.translateService.instant('actions.actions'), field: 'actions' },
  ]);

  ngOnInit() {
    this.getData(this.table.PaginationParams);
  }

  onDepartmentFilter() {
    this.getData(this.table.PaginationParams);
  }

  create() {
    this.table.openCreateUpdateDialog(CreateUpdateEmployeeComponent, () => {
      this.getData(this.table.PaginationParams);
    });
  }

  update(employee: Employee) {
    this.table.openCreateUpdateDialog(
      CreateUpdateEmployeeComponent,
      () => {
        this.getData(this.table.PaginationParams);
      },
      employee
    );
  }

  delete(employee: Employee) {
    const confirmMsg = this.translateService.instant('delete_confirm_msg');
    const header = this.translateService.instant('General.delete');
    const successMsg = this.translateService.instant('delete_success_msg');

    this.confirmationService.confirm({
      message: confirmMsg,
      header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.employeeDeleteUseCase.execute(employee.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: successMsg,
            });
            this.getData(this.table.PaginationParams);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err?.error?.detail,
            });
          },
        });
      },
    });
  }

  getDepartmentLabel(dept?: Department): string {
    switch (dept) {
      case Department.HR: return this.translateService.instant('employees.hr');
      case Department.IT: return this.translateService.instant('employees.it');
      case Department.Finance: return this.translateService.instant('employees.finance');
      default: return '';
    }
  }
}

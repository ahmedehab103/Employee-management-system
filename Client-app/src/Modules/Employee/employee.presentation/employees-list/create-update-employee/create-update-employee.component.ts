import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Department, Employee } from '../../../Employee.Domain/employee';
import {
  EmployeePostProviders,
  EmployeePostUseCase,
} from '../../../Employee.Application/usecases/employee-post.usecase';
import {
  EmployeePutProviders,
  EmployeePutUseCase,
} from '../../../Employee.Application/usecases/employee-put.usecase';

@Component({
  selector: 'app-create-update-employee',
  templateUrl: './create-update-employee.component.html',
  styleUrls: ['./create-update-employee.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    Button,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    DatePickerModule,
    CommonModule,
    ToggleSwitch,
  ],
  providers: [EmployeePostProviders, EmployeePutProviders],
})
export class CreateUpdateEmployeeComponent implements OnInit {
  public form: FormGroup;
  public loading = false;
  public submitted = false;

  public data: Employee;

  public readonly departmentOptions = [
    { label: 'HR', value: Department.HR },
    { label: 'IT', value: Department.IT },
    { label: 'Finance', value: Department.Finance },
  ];

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly employeePostUseCase = inject(EmployeePostUseCase);
  private readonly employeePutUseCase = inject(EmployeePutUseCase);

  constructor() {
    this.data = this.config.data;

    this.form = new FormGroup({
      fullName: new FormControl(this.data?.fullName ?? '', [Validators.required]),
      email: new FormControl(this.data?.email ?? '', [
        Validators.required,
        Validators.email,
      ]),
      phone: new FormControl(this.data?.phone ?? ''),
      hireDate: new FormControl(
        this.data?.hireDate ? new Date(this.data.hireDate) : null,
        [Validators.required]
      ),
      salary: new FormControl(this.data?.salary ?? null, [
        Validators.required,
        Validators.min(0),
      ]),
      department: new FormControl(
        this.data?.department ?? null,
        [Validators.required]
      ),
      isActive: new FormControl(this.data?.isActive ?? true),
    });
  }

  get fullName(): FormControl { return this.form.get('fullName') as FormControl; }
  get email(): FormControl { return this.form.get('email') as FormControl; }
  get phone(): FormControl { return this.form.get('phone') as FormControl; }
  get hireDate(): FormControl { return this.form.get('hireDate') as FormControl; }
  get salary(): FormControl { return this.form.get('salary') as FormControl; }
  get department(): FormControl { return this.form.get('department') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }

  ngOnInit() {}

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.loading = false;
      return;
    }

    this.loading = true;

    const hireDateValue: Date = this.hireDate.value;
    const employee: Employee = {
      id: this.data?.id,
      fullName: this.fullName.value,
      email: this.email.value,
      phone: this.phone.value,
      hireDate: hireDateValue ? hireDateValue.toISOString().split('T')[0] : undefined,
      salary: this.salary.value,
      department: this.department.value,
      isActive: this.isActive.value,
    };

    if (this.data?.id) {
      this.employeePutUseCase
        .execute(employee)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => this.closeDialog(true),
          error: (err) => this.handleError(err),
        });
    } else {
      this.employeePostUseCase
        .execute(employee)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => this.closeDialog(true),
          error: (err) => this.handleError(err),
        });
    }
  }

  handleError(err: any) {
    if (err.status === 422) {
      Object.entries(err.error.errors).forEach(([key, value]) => {
        this.form.get(key)?.setErrors({ serverError: value });
      });
    }
  }

  closeDialog(isConfirmed = false) {
    this.ref.close({ confirmed: isConfirmed });
  }
}

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
import { TextareaModule } from 'primeng/textarea';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  UserPostProviders,
  UserPostUseCase,
} from '../../../Identity.Application/usecases/userPost.usecase';
import {
  UserPutProviders,
  UserPutUseCase,
} from '../../../Identity.Application/usecases/userPut.usecase';
import { Role, User } from '../../../Identity.Domain/user';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { Company } from '../../../../assetsCrm/assetsCrm.Domain/company';
import {
  CompaniesGetLookUpProviders,
  CompaniesGetLookUpUseCase,
} from '../../../../assetsCrm/assetsCrm.Application/usecases/company/companiesGetLookUp.usecase';

@Component({
  selector: 'app-create-update-users',
  templateUrl: './create-update-users.component.html',
  styleUrls: ['./create-update-users.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    Button,
    InputTextModule,
    TextareaModule,
    SelectModule,
    CommonModule,
    ToggleSwitch,
    MultiSelectModule,
  ],
  providers: [UserPostProviders, UserPutProviders, CompaniesGetLookUpProviders],
})
export class CreateUpdateUsersComponent implements OnInit {
  public form: FormGroup;
  public loading: boolean = false;
  public submitted: boolean = false;
  public imagePreview: string | ArrayBuffer | null | any;
  public companies: Company[] = [];

  public data: User;

  public users: User[] = [];

  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly userPutUseCase = inject(UserPutUseCase);
  private readonly userPostUseCase = inject(UserPostUseCase);
  private readonly companiesGetLookUpUseCase = inject(
    CompaniesGetLookUpUseCase
  );

  constructor() {
    this.data = this.config.data;
    console.log(
      '📢[create-update-users.component.ts:72]: this.data: ',
      this.data
    );
    this.form = new FormGroup({
      fullName: new FormGroup({
        FirstName: new FormControl(this.data?.fullName?.firstName ?? '', [
          Validators.required,
        ]),
        LastName: new FormControl(
          this.data?.fullName?.lastName ?? '',
          Validators.required
        ),
      }),
      email: new FormControl(this.data?.email ?? '', [
        Validators.required,
        Validators.email,
      ]),
      phoneNumber: new FormControl(this.data?.phoneNumber ?? '', [
        Validators.required,
      ]),
      password: new FormControl({
        value: null,
        disabled: this.data ? true : false,
      }),
      confirmPassword: new FormControl({
        value: null,
        disabled: this.data ? true : false,
      }),
      isChangePassword: new FormControl(false, [Validators.required]),
      companiesIds: new FormControl(this.data?.companies ?? [], [
        Validators.required,
      ]),
    });
  }

  get firstName(): FormControl {
    return this.form.get('fullName.FirstName') as FormControl;
  }

  get lastName(): FormControl {
    return this.form.get('fullName.LastName') as FormControl;
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get phoneNumber(): FormControl {
    return this.form.get('phoneNumber') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }

  get isChangePassword(): FormControl {
    return this.form.get('isChangePassword') as FormControl;
  }

  get companiesIds(): FormControl {
    return this.form.get('companiesIds') as FormControl;
  }

  ngOnInit() {
    this.companiesGetLookUpUseCase.execute().subscribe((data) => {
      this.companies = data;
      const x = this.filterByIds(this.companies, this.data?.companies!);
      this.companiesIds.setValue(x);
    });

    this.isChangePassword.valueChanges.subscribe((value) => {
      if (value) {
        this.password.enable();
        this.confirmPassword.enable();
      } else {
        this.password.disable();
        this.password.setValue(null);
        this.confirmPassword.disable();
        this.confirmPassword.setValue(null);
      }
    });
  }

  filterByIds(objects: Company[], filterIds: any[]) {
    const idsToFilter = filterIds?.map((item) => item.id);
    return objects.filter((obj) => idsToFilter.includes(obj.id));
  }

  create(user: User, password: string, confirmPassword: string) {
    this.userPostUseCase
      .execute({ user, password, confirmPassword })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.closeDialog(true);
        },
        error: (err) => {
          this.handleError(err, this.form);
        },
      });
  }

  update(user: User, password: string, confirmPassword: string) {
    this.userPutUseCase
      .execute({ user, password, confirmPassword })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.closeDialog(true);
        },
        error: (err) => {
          this.handleError(err, this.form);
        },
      });
  }

  handleError(err: any, form: FormGroup) {
    if (err.status == 422) {
      Object.entries(err.error.errors).forEach(([key, value]) => {
        form.get(key)?.setErrors({ serverError: value });
      });
    }
  }

  submit() {
    this.loading = true;
    this.submitted = true;

    const user: User = {
      id: this.data?.id,
      fullName: {
        firstName: this.firstName?.value,
        lastName: this.lastName?.value,
      },
      email: this.email?.value,
      phoneNumber: this.phoneNumber?.value,
      role: Role.User,
      companies: this.companiesIds.value,
    };
    const password = this.password?.value;
    const confirmPassword = this.confirmPassword?.value;

    if (this.data?.id) {
      this.update(user, password, confirmPassword);
    } else {
      this.create(user, password, confirmPassword);
    }
  }

  closeDialog(isConfirmed: boolean = false) {
    this.ref.close({ confirmed: isConfirmed });
  }
}

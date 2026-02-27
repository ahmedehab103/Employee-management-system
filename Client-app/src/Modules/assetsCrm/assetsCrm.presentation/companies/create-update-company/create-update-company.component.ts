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
import {
  CompaniesPostProviders,
  CompaniesPostUseCase,
} from '../../../assetsCrm.Application/usecases/company/companiesPost.usecase';
import { finalize } from 'rxjs';
import { Company } from '../../../assetsCrm.Domain/company';
import {
  CompaniesPutProviders,
  CompaniesPutUseCase,
} from '../../../assetsCrm.Application/usecases/company/companiesPut.usecase';
import { LocalizedString } from '../../../../Common/domain/localized-string';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-update-company',
  templateUrl: './create-update-company.component.html',
  styleUrls: ['./create-update-company.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    Button,
    InputTextModule,
    TextareaModule,
    SelectModule,
    CommonModule,
  ],
  providers: [CompaniesPostProviders, CompaniesPutProviders],
})
export class CreateUpdateCompanyComponent implements OnInit {
  public form: FormGroup;
  public loading: boolean = false;
  public submitted: boolean = false;
  public imagePreview: string | ArrayBuffer | null | any;

  private data: Company;

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly companiesPostUseCase = inject(CompaniesPostUseCase);
  private readonly companiesPutUseCase = inject(CompaniesPutUseCase);

  constructor() {
    this.data = this.config.data;

    this.imagePreview = this.data?.logo ?? '';
    this.form = new FormGroup({
      name: new FormGroup({
        Ar: new FormControl(this.data?.name?.ar ?? '', [Validators.required]),
        En: new FormControl(this.data?.name?.en ?? '', Validators.required),
      }),
      logo: new FormControl(null, Validators.required),
    });
  }

  get arName(): FormControl {
    return this.form.get('name.Ar') as FormControl;
  }

  get enName(): FormControl {
    return this.form.get('name.En') as FormControl;
  }

  get logo(): FormControl {
    return this.form.get('logo') as FormControl;
  }

  ngOnInit() {}

  onSelectedFiles(event: any) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      let selectedFile = input.files[0];
      // Preview Image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };

      reader.readAsDataURL(selectedFile);
      this.logo.setValue(selectedFile);
    }
  }

  add(company: Company) {
    this.companiesPostUseCase
      .execute({ company: company, logo: this.logo.value })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.ref.close(this.data);
        },
        error: (err) => {
          this.handleError(err, this.form);
        },
      });
  }

  update(company: Company) {
    this.companiesPutUseCase
      .execute({ company: company, logo: this.logo.value })
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

    const company: Company = {
      id: this.data?.id,
      name: new LocalizedString(this.arName.value, this.enName.value),
    };

    if (this.data?.id) {
      this.update(company);
    } else {
      this.add(company);
    }
  }

  closeDialog(isConfirmed: boolean = false) {
    this.ref.close({ confirmed: isConfirmed });
  }
}

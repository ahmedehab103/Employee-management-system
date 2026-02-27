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
import { LocalizedString } from '../../../../Common/domain/localized-string';
import { CommonModule } from '@angular/common';
import { Project } from '../../../assetsCrm.Domain/project';
import {
  ProjectsPutProviders,
  ProjectsPutUseCase,
} from '../../../assetsCrm.Application/usecases/projects/projectsPut.usecase';
import {
  ProjectsPostProviders,
  ProjectsPostUseCase,
} from '../../../assetsCrm.Application/usecases/projects/projectsPost.usecase';
import { Company } from '../../../assetsCrm.Domain/company';
import {
  CompaniesGetLookUpProviders,
  CompaniesGetLookUpUseCase,
} from '../../../assetsCrm.Application/usecases/company/companiesGetLookUp.usecase';

@Component({
  selector: 'app-create-update-project',
  templateUrl: './create-update-project.component.html',
  styleUrls: ['./create-update-project.component.scss'],
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
  providers: [
    ProjectsPostProviders,
    ProjectsPutProviders,
    CompaniesGetLookUpProviders,
  ],
})
export class CreateUpdateProjectComponent implements OnInit {
  public form: FormGroup;
  public loading: boolean = false;
  public submitted: boolean = false;
  public imagePreview: string | ArrayBuffer | null | any;

  private data: Project;

  public companies: Company[] = [];

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly projectsPostUseCase = inject(ProjectsPostUseCase);
  private readonly projectsPutUseCase = inject(ProjectsPutUseCase);
  private readonly companiesGetLookUpUseCase = inject(
    CompaniesGetLookUpUseCase
  );

  constructor() {
    this.data = this.config.data;
    console.log(
      '📢[create-update-project.component.ts:72]: this.data: ',
      this.data
    );
    this.form = new FormGroup({
      name: new FormGroup({
        Ar: new FormControl(this.data?.name?.ar ?? '', [Validators.required]),
        En: new FormControl(this.data?.name?.en ?? '', Validators.required),
      }),
      company: new FormControl(this.data?.company ?? '', Validators.required),
    });
  }

  get arName(): FormControl {
    return this.form.get('name.Ar') as FormControl;
  }

  get enName(): FormControl {
    return this.form.get('name.En') as FormControl;
  }

  get company(): FormControl {
    return this.form.get('company') as FormControl;
  }

  ngOnInit() {
    this.companiesGetLookUpUseCase.execute().subscribe((response) => {
      this.companies = response;
    });
  }

  create(project: Project) {
    console.log(
      '📢[create-update-project.component.ts:104]: project: ',
      project
    );
    this.projectsPostUseCase
      .execute(project)
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

  update(project: Project) {
    this.projectsPutUseCase
      .execute(project)
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

    const project: Project = {
      id: this.data?.id,
      name: new LocalizedString(this.arName.value, this.enName.value),
      company: {
        id: this.company.value.id,
      },
    };

    if (this.data?.id) {
      this.update(project);
    } else {
      this.create(project);
    }
  }

  closeDialog(isConfirmed: boolean = false) {
    this.ref.close({ confirmed: isConfirmed });
  }
}

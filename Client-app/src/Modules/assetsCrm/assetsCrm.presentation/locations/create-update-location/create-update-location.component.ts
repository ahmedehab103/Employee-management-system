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
import { Company } from '../../../assetsCrm.Domain/company';
import { CompaniesGetLookUpUseCase } from '../../../assetsCrm.Application/usecases/company/companiesGetLookUp.usecase';
import {
  AssetLocationPostProviders,
  AssetLocationPostUseCase,
} from '../../../assetsCrm.Application/usecases/Assetslocation/assetslocationPost.usecase';
import {
  AssetLocationPutProviders,
  AssetLocationPutUseCase,
} from '../../../assetsCrm.Application/usecases/Assetslocation/assetslocationPut.usecase';
import { AssetLocation } from '../../../assetsCrm.Domain/assetLocation';

@Component({
  selector: 'app-create-update-location',
  templateUrl: './create-update-location.component.html',
  styleUrls: ['./create-update-location.component.scss'],
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
  providers: [AssetLocationPostProviders, AssetLocationPutProviders],
})
export class CreateUpdateLocationComponent implements OnInit {
  public form: FormGroup;
  public loading: boolean = false;
  public submitted: boolean = false;
  public imagePreview: string | ArrayBuffer | null | any;

  private data: Project;

  public companies: Company[] = [];

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly locationsPostUseCase = inject(AssetLocationPostUseCase);
  private readonly locationsPutUseCase = inject(AssetLocationPutUseCase);

  constructor() {
    this.data = this.config.data;

    this.form = new FormGroup({
      name: new FormGroup({
        Ar: new FormControl(this.data?.name?.ar ?? '', [Validators.required]),
        En: new FormControl(this.data?.name?.en ?? '', Validators.required),
      }),
    });
  }

  get arName(): FormControl {
    return this.form.get('name.Ar') as FormControl;
  }

  get enName(): FormControl {
    return this.form.get('name.En') as FormControl;
  }

  ngOnInit() {}

  create(location: AssetLocation) {
    this.locationsPostUseCase
      .execute(location)
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

  update(location: AssetLocation) {
    this.locationsPutUseCase
      .execute(location)
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

    const location: AssetLocation = {
      id: this.data?.id,
      name: new LocalizedString(this.arName.value, this.enName.value),
    };

    if (this.data?.id) {
      this.update(location);
    } else {
      this.create(location);
    }
  }

  closeDialog(isConfirmed: boolean = false) {
    this.ref.close({ confirmed: isConfirmed });
  }
}

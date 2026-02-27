import { FilterComponent } from './../filter/filter.component';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { Asset } from '../../assetsCrm.Domain/asset';
import {
  AssetGetPageProviders,
  AssetsGetPageUseCase,
} from '../../assetsCrm.Application/usecases/assets/assetsGetPage.usecase';
import { LocalizationService } from '../../../Common/domain/servies/localization-service';
import { LanguageType } from '../../../Common/domain/language';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateUpdateDialogComponent } from './create-update-assets/create-update-assets.component';
import { Router, RouterModule } from '@angular/router';
import { Value } from '../../assetsCrm.Domain/value';
import {
  AssetsPutValueProviders,
  AssetsPutValueUseCase,
} from '../../assetsCrm.Application/usecases/assets/assetsPutValue.usecase';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Select } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import {
  AssetsPutValueIsCurrentUseCase,
  AssetsPutValueIsCurrentUseCaseProviders,
} from '../../assetsCrm.Application/usecases/assets/assetsPutValueIsCurrent.usecase';
import { Tooltip } from 'primeng/tooltip';
import {
  AssetsPostValueProviders,
  AssetsPostValueUseCase,
} from '../../assetsCrm.Application/usecases/assets/assetsPostValue.usecase';
import { assetsRepositoryProvider } from '../../assetsCrm.Application/repositories/assets.repository';
import {
  PaginationRespons,
  PaginationParams,
} from '../../../Common/domain/pagination';
import { TableComponent } from '../../../Common/presentation/tableComponent';
import { PaginatorModule } from 'primeng/paginator';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Skeleton } from 'primeng/skeleton';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../Identity/Identity.Application/auth-service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import {
  AssetsDeleteProviders,
  AssetsDeleteUseCase,
} from '../../assetsCrm.Application/usecases/assets/assetsDelete.usecase';
import {
  AssetsDeleteValueProviders,
  AssetsDeleteValueUseCase,
} from '../../assetsCrm.Application/usecases/assets/assetsDeleteValue.usecase';
import { LocalizedString } from '../../../Common/domain/localized-string';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    SelectModule,
    FormsModule,
    TableModule,
    InputGroupAddonModule,
    InputGroup,
    InputTextModule,
    ButtonModule,
    CurrencyPipe,
    DatePipe,
    RouterModule,
    ReactiveFormsModule,
    Toast,
    Select,
    TagModule,
    CommonModule,
    Tooltip,
    PaginatorModule,
    ConfirmDialog,
    FilterComponent,
    InputNumberModule,
  ],
  providers: [
    AssetGetPageProviders,
    AssetsDeleteProviders,
    AssetsPutValueProviders,
    assetsRepositoryProvider,
    AssetsPostValueProviders,
    AssetsDeleteValueProviders,
    AssetsPutValueIsCurrentUseCaseProviders,
    ConfirmationService,
    MessageService,
    DialogService,
  ],
})
export class AssetsListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);

  private readonly assetsDeleteUseCase = inject(AssetsDeleteUseCase);
  private readonly _assetsGetPageUseCase = inject(AssetsGetPageUseCase);
  private readonly assetsPutValueUseCase = inject(AssetsPutValueUseCase);
  private readonly assetsPostValueUseCase = inject(AssetsPostValueUseCase);
  private readonly assetsDeleteValueUseCase = inject(AssetsDeleteValueUseCase);
  private readonly assetsPutValueIsCurrentUseCase = inject(
    AssetsPutValueIsCurrentUseCase
  );

  private readonly confirmationService = inject(ConfirmationService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly _localizationService: LocalizationService =
    inject(LocalizationService);

  public readonly authService = inject(AuthService);

  public searchQuery: {
    data: string;
  } = {
    data: '',
  };

  public pagesData: {
    data?: PaginationRespons<Asset>;
  } = {
    data: undefined,
  };

  public projectsIds: {
    data?: string[];
  } = {
    data: undefined,
  };

  private assetId: string = '';
  private report!: File;
  private editingRow: any = null; // Tracks the row currently being edited
  private originalValue: Value | null = null; // Original state of the edited row

  public readonly table: TableComponent<Asset> = new TableComponent(
    this.translateService,
    this.dialogService,
    this.messageService,
    this.confirmationService,
    this.getData,
    this.searchQuery,
    this._assetsGetPageUseCase,
    this.pagesData,
    this.projectsIds
  );

  public uploadedReport: any;
  public newValue: any = {};
  public assets: Asset[] = [];
  public currentValues: any[] = [];
  public dateNow: Date = new Date();

  public isEdit: boolean = false;
  public loading: boolean = false;
  public isEmpty: boolean = false;
  public submitted: boolean = false;
  public isNewValue: boolean = false;
  public valueLoading: boolean = false;
  public updateLoading: any = {};

  public LanguageType = LanguageType;

  public imageUrlBase: string = environment.imgUrl;

  public no: string = this.translateService.instant('General.no');
  public yes: string = this.translateService.instant('General.yes');
  public final: string = this.translateService.instant('AssetsList.final');
  public draft: string = this.translateService.instant('AssetsList.draft');
  public summary: string = this.translateService.instant('AssetsList.summary');
  public detailed: string = this.translateService.instant(
    'AssetsList.detailed'
  );

  public lang: any = signal(this._localizationService.getCurrentLang());

  public isFinalOptions = signal([
    { label: this.final, value: true },
    { label: this.draft, value: false },
  ]);

  public isRentalOptions = signal([
    { label: this.yes, value: true },
    { label: this.no, value: false },
  ]);

  public isDetailedOptions = signal([
    { label: this.detailed, value: true },
    { label: this.summary, value: false },
  ]);

  public columns = signal<any[]>([
    {
      header: this.translateService.instant('AssetsList.name'),
      field: this.lang().name == 'en' ? 'name.en' : 'name.ar',
    },
    {
      header: this.translateService.instant('AssetsList.project_name'),
      field: 'project.translatedName',
    },
    {
      header: this.translateService.instant('AssetsList.location'),
      field: 'location.translatedName',
    },
    {
      header: this.translateService.instant('AssetsList.current_value'),
      field: 'currentValue.value',
    },
    {
      header: this.translateService.instant('AssetsList.rental_value'),
      field: 'rentalValue.value',
    },
    {
      header: this.translateService.instant('AssetsList.evaluated_at'),
      field: 'currentValue.evaluatedAt',
    },
    {
      header: this.translateService.instant('AssetsList.actions'),
    },
  ]);
  expandedRows: any = {};

  ngOnInit() {
    this.getData(this.table.PaginationParams);
  }

  onFilter(event: any) {
    this.projectsIds.data = event.projectsIds;
    this.getData(this.table.PaginationParams);
  }

  getData(
    params: PaginationParams,
    usecase: AssetsGetPageUseCase = this._assetsGetPageUseCase
  ) {
    usecase
      .execute({ params: params, projectsIds: this.projectsIds.data ?? [] })
      .subscribe((data) => {
        this.pagesData.data = data;
      });
  }

  create() {
    this.table.openCreateUpdateDialog(CreateUpdateDialogComponent, () => {
      this.getData(this.table.PaginationParams);
    });
  }

  update(asset: Asset) {
    this.table.openCreateUpdateDialog(
      CreateUpdateDialogComponent,
      () => {
        this.getData(this.table.PaginationParams);
      },
      asset
    );
  }
  delete(asset: Asset) {
    this.table.delete(asset, this.assetsDeleteUseCase, () => {
      this.getData(this.table.PaginationParams);
    });
  }

  view(asset: Asset) {
    this.router.navigate([`/asset/${asset.id}`]);
  }

  showMap() {
    this.router.navigate([`/map`]);
  }

  translate(text: LocalizedString) {
    return LocalizedString.getString(text);
  }

  onRowExpand(event: any): void {
    if (event.data && event.data.id) {
      this.expandedRows = {};
      this.expandedRows[event.data.id] = true;
    }

    this.currentValues = event.data.values;
    this.isEmpty = this.currentValues == null ? true : false;
    this.currentValues = this.currentValues ?? ['empty'];
  }

  onRowCollapse(event: any): void {
    this.isNewValue = false;
  }

  createValue() {
    this.isNewValue = true;
  }

  saveNewValue(assetId: string) {
    let newValue: Value = {
      value: this.newValue.value,
      evaluatedAt: this.dateNow,
      evaluatedBy: '',
      reportUrl: this.newValue.reportUrl,
      assetId: assetId,
      isFinal: this.newValue.isFinal,
      isCurrent: false,
      detailed: this.newValue.detailed,
      isRental: this.newValue.isRental,
      id: '',
    };
    this.valueLoading = true;

    this.assetsPostValueUseCase
      .execute({ value: newValue, report: this.report })
      .pipe(finalize(() => (this.valueLoading = false)))
      .subscribe({
        next: (response: any) => {
          this.isNewValue = false;
          newValue.id = response.id;

          if (!this.currentValues[0].id) this.currentValues = [];
          this.isEmpty = false;

          this.currentValues.unshift(newValue);
          this.newValue = {};

          const successMsg = this.translateService.instant(
            'AssetsList.added_value_success'
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: successMsg,
            life: 3000,
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'error',
            detail: err.error.errors.value,
            life: 3000,
          });
        },
      });
  }

  cancelNewValue() {
    this.isNewValue = false;
  }

  startEditing(value: Value, assetId: string) {
    this.assetId = assetId;
    this.editingRow = value;
    if (value.id) this.originalValue = { ...value };
  }

  onRowEditSave(value: Value, i: number) {
    this.originalValue = value.id
      ? { ...value, assetId: this.assetId }
      : { ...value, id: this.originalValue!.id, assetId: this.assetId };
    const obj: Value = {
      ...value,
      id: this.originalValue!.id,
      assetId: this.assetId,
    };

    this.valueLoading = true;
    this.updateLoading = { i: i, loading: true };

    this.assetsPutValueUseCase
      .execute({ value: obj!, report: this.report })
      .pipe(finalize(() => (this.updateLoading.loading = false)))
      .subscribe({
        next: (response) => {
          const successMsg = this.translateService.instant(
            'AssetsList.update_value_success'
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: successMsg,
            life: 3000,
          });
        },
        error: (error) => {
          const errorMsg = this.translateService.instant(
            'AssetsList.update_value_err'
          );
          this.messageService.add({
            severity: 'error',
            summary: 'error',
            detail: errorMsg,
            life: 3000,
          });
        },
      });
  }

  onRowEditCancel(value: Value) {
    if (this.editingRow) {
      Object.assign(this.editingRow, this.originalValue);
      this.editingRow = null;
    }
  }

  onSelectedFiles(event: any) {
    const input = event.target as HTMLInputElement;

    if (input?.files) {
      const file = input.files[0];
      this.report = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedReport = {
          name: file.name,
          url: reader.result as string,
        };
        this.newValue.reportUrl = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  putCurrent(value: Value, assetId: string) {
    this.confirmationService.confirm({
      header: this.translateService.instant('AssetsList.put_current'),
      rejectLabel: this.translateService.instant('General.cancel'),
      message: this.translateService.instant('AssetsList.put_current_msg'),

      icon: 'pi pi-info-circle',

      rejectButtonProps: {
        label: this.translateService.instant('General.cancel'),
        severity: 'secondary',
        // variant: 'text',
      },

      acceptButtonProps: {
        label: this.translateService.instant('General.ok'),
      },

      accept: () => {
        this.assetsPutValueIsCurrentUseCase
          .execute({ assetId: assetId, valueId: value.id })
          .subscribe({
            next: (response) => {
              const successMsg = this.translateService.instant(
                'AssetsList.put_current_success'
              );
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: successMsg,
                life: 3000,
              });
            },
            error: (error) => {
              const errorMsg = this.translateService.instant(
                'AssetsList.put_current_error'
              );
              this.messageService.add({
                severity: 'error',
                summary: 'error',
                detail: errorMsg,
                life: 3000,
              });
            },
          });
      },
      reject: () => {},
    });
  }

  deleteValue(valueId: string, assetId: string) {
    const successMsg = this.translateService.instant('delete_success_msg');
    const confirmMsg = this.translateService.instant('delete_confirm_msg');
    const header = this.translateService.instant('General.12');

    const data = { assetId: assetId, valueId: valueId };

    this.confirmationService.confirm({
      message: confirmMsg,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.assetsDeleteValueUseCase.execute(data).subscribe({
          next: (_res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: successMsg,
            });
            this.getData(this.table.PaginationParams);
          },
          error: (err) => {
            const deleteError = err?.error?.detail;

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: deleteError,
            });
          },
        });
      },
    });
  }

  getSeverity(status: boolean) {
    switch (status) {
      case true:
        return 'success';
      default:
        return 'warn';
    }
  }
}

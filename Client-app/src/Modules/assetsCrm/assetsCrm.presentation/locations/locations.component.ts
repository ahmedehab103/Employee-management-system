import { Toast } from 'primeng/toast';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../Common/domain/pagination';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroup } from 'primeng/inputgroup';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TableComponent } from '../../../Common/presentation/tableComponent';
import { environment } from '../../../../environments/environment';
import { AssetLocation } from '../../assetsCrm.Domain/assetLocation';
import {
  AssetLocationDeleteProviders,
  AssetLocationDeleteUseCase,
} from '../../assetsCrm.Application/usecases/Assetslocation/assetslocationDelete.usecase';
import {
  AssetLocationGetPageUseCase,
  AssetslocationGetPageProviders,
} from '../../assetsCrm.Application/usecases/Assetslocation/assetslocationGetPage.usecase';
import { CreateUpdateLocationComponent } from './create-update-location/create-update-location.component';
import { AuthService } from '../../../Identity/Identity.Application/auth-service';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-location',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    SelectModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    CurrencyPipe,
    Toast,
    InputGroupAddonModule,
    InputGroup,
    PaginatorModule,
    ConfirmDialog,
    BadgeModule,
  ],
  providers: [
    AssetLocationDeleteProviders,
    AssetslocationGetPageProviders,
    DialogService,
    MessageService,
    ConfirmationService,
  ],
})
export class LocationsComponent implements OnInit {
  public readonly authService = inject(AuthService);

  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly locationsDeleteUseCase = inject(AssetLocationDeleteUseCase);
  private readonly locationsGetPageUseCase = inject(
    AssetLocationGetPageUseCase
  );

  public searchQuery: {
    data: string;
  } = {
    data: '',
  };

  public pagesData: {
    data?: PaginationRespons<AssetLocation>;
  } = {
    data: undefined,
  };

  public readonly table: TableComponent<AssetLocation> = new TableComponent(
    this.translateService,
    this.dialogService,
    this.messageService,
    this.confirmationService,
    this.getData,
    this.searchQuery,
    this.locationsGetPageUseCase,
    this.pagesData
  );

  public loading: boolean = false;

  public submitted: boolean = false;

  public imageUrlBase: string = environment.imgUrl;

  public readonly columns = signal<any[]>([
    {
      name: this.translateService.instant('arabic_name'),
      field: 'name.ar',
    },
    {
      name: this.translateService.instant('english_name'),
      field: 'name.en',
    },
    {
      name: this.translateService.instant('completion_percentage'),
      field: 'completionPercentage',
    },
    {
      name: this.translateService.instant('assets'),
      field: 'assetsValue',
    },
    {
      name: this.translateService.instant('total_asset_revenue'),
      field: 'totalAssetRevenue',
    },
    {
      name: this.translateService.instant('properties_number'),
      field: 'assetsNumber',
    },
  ]);

  constructor() {
    if (this.authService.isEditor())
      this.columns().push(this.translateService.instant('AssetsList.actions'));
  }

  ngOnInit() {
    this.getData(this.table.PaginationParams);
  }

  getData(
    params: PaginationParams,
    usecase: AssetLocationGetPageUseCase = this.locationsGetPageUseCase
  ) {
    usecase.execute(params).subscribe((data) => {
      this.pagesData.data = data;
    });
  }

  create() {
    this.table.openCreateUpdateDialog(CreateUpdateLocationComponent, () => {
      this.getData(this.table.PaginationParams);
    });
  }

  update(location: AssetLocation) {
    this.table.openCreateUpdateDialog(
      CreateUpdateLocationComponent,
      () => {
        this.getData(this.table.PaginationParams);
      },
      location
    );
  }

  delete(location: AssetLocation) {
    this.table.delete(location, this.locationsDeleteUseCase, () => {
      this.getData(this.table.PaginationParams);
    });
  }

  stockSeverity(locations: AssetLocation) {
    if (locations.completionPercentage === 0) return 'danger';
    else if (
      locations.completionPercentage! > 0 &&
      locations.completionPercentage! < 50
    )
      return 'warn';
    else return 'success';
  }

  removeDecimals(value: number) {
    return Math.trunc(value);
  }
}

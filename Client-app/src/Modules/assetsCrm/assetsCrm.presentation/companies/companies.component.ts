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
  CompaniesGetPageProviders,
  CompaniesGetPageUseCase,
} from '../../assetsCrm.Application/usecases/company/companiesGetPage.usecase';
import {
  PaginationParams,
  PaginationRespons,
} from '../../../Common/domain/pagination';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateUpdateCompanyComponent } from './create-update-company/create-update-company.component';
import { Company } from '../../assetsCrm.Domain/company';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroup } from 'primeng/inputgroup';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialog } from 'primeng/confirmdialog';
import {
  CompaniesDeleteProviders,
  CompaniesDeleteUseCase,
} from '../../assetsCrm.Application/usecases/company/companiesDelete.usecase';
import { TableComponent } from '../../../Common/presentation/tableComponent';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../Identity/Identity.Application/auth-service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
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
  ],
  providers: [
    CompaniesGetPageProviders,
    CompaniesDeleteProviders,
    DialogService,
    MessageService,
    ConfirmationService,
  ],
})
export class CompaniesComponent implements OnInit {
  public readonly authService = inject(AuthService);

  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly companiesDeleteUseCase = inject(CompaniesDeleteUseCase);
  private readonly companiesGetPageUseCase = inject(CompaniesGetPageUseCase);

  public searchQuery: {
    data: string;
  } = {
    data: '',
  };

  public pagesData: {
    data?: PaginationRespons<Company>;
  } = {
    data: undefined,
  };

  public readonly table: TableComponent<Company> = new TableComponent(
    this.translateService,
    this.dialogService,
    this.messageService,
    this.confirmationService,
    this.getData,
    this.searchQuery,
    this.companiesGetPageUseCase,
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
    { name: this.translateService.instant('companies.logo'), field: 'logo' },
    {
      name: this.translateService.instant('assets'),
      field: 'assetsValue',
    },
    {
      name: this.translateService.instant('total_asset_revenue'),
      field: 'totalAssetRevenue',
    },
    {
      name: this.translateService.instant('companies.assets_number'),
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
    usecase: CompaniesGetPageUseCase = this.companiesGetPageUseCase
  ) {
    usecase.execute(params).subscribe((data) => {
      this.pagesData.data = data;
    });
  }

  create() {
    this.table.openCreateUpdateDialog(CreateUpdateCompanyComponent, () => {
      this.getData(this.table.PaginationParams);
    });
  }

  update(company: Company) {
    this.table.openCreateUpdateDialog(
      CreateUpdateCompanyComponent,
      () => {
        this.getData(this.table.PaginationParams);
      },
      company
    );
  }

  delete(company: Company) {
    this.table.delete(company, this.companiesDeleteUseCase, () => {
      this.getData(this.table.PaginationParams);
    });
  }
}

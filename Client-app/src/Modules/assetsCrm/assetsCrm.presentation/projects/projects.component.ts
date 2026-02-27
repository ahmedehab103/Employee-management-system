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
import { CreateUpdateProjectComponent } from './create-update-project/create-update-project.component';
import { Project } from '../../assetsCrm.Domain/project';
import {
  ProjectsGetPageProviders,
  ProjectsGetPageUseCase,
} from '../../assetsCrm.Application/usecases/projects/projectsGetPage.usecase';
import {
  projectsDeleteProviders,
  ProjectsDeleteUseCase,
} from '../../assetsCrm.Application/usecases/projects/projectsDelete.usecase';
import { AuthService } from '../../../Identity/Identity.Application/auth-service';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  CompaniesGetLookUpProviders,
  CompaniesGetLookUpUseCase,
} from '../../assetsCrm.Application/usecases/company/companiesGetLookUp.usecase';
import { Company } from '../../assetsCrm.Domain/company';
import { BadgeModule } from 'primeng/badge';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
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
    MultiSelectModule,
    BadgeModule,
  ],
  providers: [
    projectsDeleteProviders,
    ProjectsGetPageProviders,
    CompaniesGetLookUpProviders,
    DialogService,
    MessageService,
    ConfirmationService,
  ],
})
export class ProjectsComponent implements OnInit {
  public readonly authService = inject(AuthService);

  private readonly route = inject(ActivatedRoute);

  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly projectsDeleteUseCase = inject(ProjectsDeleteUseCase);
  private readonly projectsGetPageUseCase = inject(ProjectsGetPageUseCase);
  private readonly companiesGetLookUpUseCase = inject(
    CompaniesGetLookUpUseCase
  );

  public companies: Company[] = [];
  public selectedCompanies: string[] = [];

  public searchQuery: {
    data: string;
  } = {
    data: '',
  };

  public pagesData: {
    data?: PaginationRespons<Project>;
  } = {
    data: undefined,
  };

  public readonly table: TableComponent<Project> = new TableComponent(
    this.translateService,
    this.dialogService,
    this.messageService,
    this.confirmationService,
    this.getData,
    this.searchQuery,
    this.projectsGetPageUseCase,
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
      name: this.translateService.instant('projects.company'),
      field: 'company',
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
    this.selectedCompanies = this.route.snapshot.params['companyId'];

    this.getData(this.table.PaginationParams);
    this.getCompanies();
  }

  getData(
    params: PaginationParams,
    usecase: ProjectsGetPageUseCase = this.projectsGetPageUseCase
  ) {
    const obj = { params: params, CompaniesIds: this.selectedCompanies };
    usecase.execute(obj).subscribe((data) => {
      this.pagesData.data = data;
    });
  }

  create() {
    this.table.openCreateUpdateDialog(CreateUpdateProjectComponent, () => {
      this.getData(this.table.PaginationParams);
    });
  }

  update(project: Project) {
    this.table.openCreateUpdateDialog(
      CreateUpdateProjectComponent,
      () => {
        this.getData(this.table.PaginationParams);
      },
      project
    );
  }

  delete(project: Project) {
    this.table.delete(project, this.projectsDeleteUseCase, () => {
      this.getData(this.table.PaginationParams);
    });
  }

  getCompanies() {
    this.companiesGetLookUpUseCase.execute().subscribe((data) => {
      this.companies = data;
      // this.selectedCompanies = this.companies.map((c: Company) => c.id!);
    });
  }

  onFilterCompanies() {
    this.getData(this.table.PaginationParams);
  }
  onClearFilterCompanies() {
    this.selectedCompanies = [];
    this.getData(this.table.PaginationParams);
  }

  stockSeverity(projects: Project) {
    if (projects.completionPercentage === 0) return 'danger';
    else if (
      projects.completionPercentage! > 0 &&
      projects.completionPercentage! < 50
    )
      return 'warn';
    else return 'success';
  }

  removeDecimals(value: number) {
    return Math.trunc(value);
  }
}

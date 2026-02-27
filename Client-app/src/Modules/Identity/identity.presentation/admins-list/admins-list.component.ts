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
import { Role, User } from '../../Identity.Domain/user';
import {
  UserGetPageProviders,
  UserGetPageUseCase,
} from '../../Identity.Application/usecases/userGetPage.usecase';
import { CreateUpdateAdminsComponent } from './create-update-admins/create-update-admins.component';

@Component({
  selector: 'app-admins-list',
  templateUrl: './admins-list.component.html',
  styleUrls: ['./admins-list.component.scss'],
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
  ],
  providers: [
    UserGetPageProviders,
    DialogService,
    MessageService,
    ConfirmationService,
  ],
})
export class AdminsListComponent implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly userGetPageUseCase = inject(UserGetPageUseCase);

  public searchQuery: {
    data: string;
  } = {
    data: '',
  };

  public pagesData: {
    data?: PaginationRespons<User>;
  } = {
    data: undefined,
  };

  public readonly table: TableComponent<User> = new TableComponent(
    this.translateService,
    this.dialogService,
    this.messageService,
    this.confirmationService,
    this.getData,
    this.searchQuery,
    this.userGetPageUseCase,
    this.pagesData
  );

  public loading: boolean = false;

  public submitted: boolean = false;

  public imageUrlBase: string = environment.imgUrl;

  public readonly columns = signal<any[]>([
    {
      name: this.translateService.instant('accounts.full_name'),
      field: 'fullName',
    },
    {
      name: this.translateService.instant('accounts.picture_url'),
      field: 'pictureUrl',
    },
    {
      name: this.translateService.instant('accounts.email'),
      field: 'email',
    },
    {
      name: this.translateService.instant('accounts.phone_number'),
      field: 'phoneNumber',
    },
    {
      name: this.translateService.instant('actions.actions'),
      field: 'actions',
    },
  ]);

  ngOnInit() {
    this.getData(this.table.PaginationParams);
  }

  getData(
    params: PaginationParams,
    usecase: UserGetPageUseCase = this.userGetPageUseCase
  ) {
    usecase.execute({ params: params, role: Role.Admin }).subscribe((data) => {
      this.pagesData.data = data;
      console.log(
        '📢[admins-list.component.ts:120]: this.pagesData.data: ',
        this.pagesData.data
      );
    });
  }

  create() {
    this.table.openCreateUpdateDialog(CreateUpdateAdminsComponent, () => {
      this.getData(this.table.PaginationParams);
    });
  }

  update(user: User) {
    this.table.openCreateUpdateDialog(
      CreateUpdateAdminsComponent,
      () => {
        this.getData(this.table.PaginationParams);
      },
      user
    );
  }
}

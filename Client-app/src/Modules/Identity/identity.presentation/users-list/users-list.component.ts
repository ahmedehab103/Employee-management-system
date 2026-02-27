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
import { CreateUpdateUsersComponent } from './create-update-users/create-update-users.component';
import {
  UserPutImageProviders,
  UserPutImageUseCase,
} from '../../Identity.Application/usecases/userPutImages.usecase';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
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
    Tooltip,
  ],
  providers: [
    UserGetPageProviders,
    UserPutImageProviders,
    DialogService,
    MessageService,
    ConfirmationService,
  ],
})
export class UsersListComponent implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly userGetPageUseCase = inject(UserGetPageUseCase);
  private readonly userPutImageUseCase = inject(UserPutImageUseCase);

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
  public imagesLoading: boolean = false;
  public imageIndex: number = 0;

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
    usecase.execute({ params: params, role: Role.User }).subscribe((data) => {
      this.pagesData.data = data;
    });
  }

  create() {
    this.table.openCreateUpdateDialog(CreateUpdateUsersComponent, () => {
      this.getData(this.table.PaginationParams);
    });
  }

  update(user: User) {
    this.table.openCreateUpdateDialog(
      CreateUpdateUsersComponent,
      () => {
        this.getData(this.table.PaginationParams);
      },
      user
    );
  }

  onSelectedFiles(event: any, user: User, i: number) {
    const input = event.target as HTMLInputElement;
    this.imageIndex = i;

    if (input?.files) {
      Array.from(input.files).forEach((file) => {
        this.imagesLoading = true;

        this.userPutImageUseCase
          .execute({ image: file, email: user.email! })
          .subscribe(() => {
            this.imagesLoading = false;
            this.getData(this.table.PaginationParams);
          });
      });
    }
  }
}

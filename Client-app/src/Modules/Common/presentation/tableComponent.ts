import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UseCaseWithOutOutPut } from '../application/use-case';
import { PaginationParams, PaginationRespons } from '../domain/pagination';
import { signal } from '@angular/core';

export class TableComponent<T> {
  constructor(
    private readonly translateService: TranslateService,
    private readonly dialogService: DialogService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    readonly getData: any,
    readonly searchQuery: { data: string },
    readonly getpageUsecase: any,
    readonly pagesData?: {
      data?: PaginationRespons<T>;
    },
    readonly projectsIds?: any
  ) {}

  public readonly PaginationParams: PaginationParams = {
    offset: 20,
    pageIndex: 0,
    ascending: true,
    search: null,
    sortBy: null,
  };

  public readonly pageIndex = signal(this.PaginationParams.pageIndex);
  public readonly offset = signal(this.PaginationParams.offset);

  onFilter(): void {
    if (this.searchQuery.data.trim()) {
      this.getData(
        {
          ...this.PaginationParams,
          search: this.searchQuery.data,
        },
        this.getpageUsecase
      );
    }
  }

  clearFilter() {
    if (this.searchQuery.data.trim()) {
      this.searchQuery.data = '';
      this.getData(this.PaginationParams, this.getpageUsecase);
    }
  }

  //Pagination
  onPageChange(event: any) {
    const page = event.page; // Current page index
    const rows = event.rows; // Number of rows per page
    this.getData(
      {
        ...this.PaginationParams,
        pageIndex: page,
        offset: rows,
      },
      this.getpageUsecase
    );
  }

  public openCreateUpdateDialog(
    createUpdateComponent: any,
    onDialogClose: any,
    data?: T | null
  ) {
    const isCreate = data == undefined;

    const headerKey = isCreate
      ? 'Create_update_dialog.create_header'
      : 'Create_update_dialog.update_header';

    const header = this.translateService.instant(headerKey);

    const successMsgKey = isCreate
      ? 'Create_update_dialog.created_success_msg'
      : 'Create_update_dialog.updated_success_msg';

    const successMsg = this.translateService.instant(successMsgKey);

    const ref = this.dialogService.open(createUpdateComponent, {
      header: header,
      width: '50%',
      modal: true,
      closable: true,
      data: data,
    });

    ref.onClose.subscribe((response) => {
      if (response.confirmed) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: successMsg,
        });
        onDialogClose();
      }
    });
  }

  delete(
    data: any,
    deleteUsecase: UseCaseWithOutOutPut<string>,
    onDelete: any
  ) {
    const successMsg = this.translateService.instant('delete_success_msg');
    const confirmMsg = this.translateService.instant('delete_confirm_msg');
    const header = this.translateService.instant('General.delete');

    this.confirmationService.confirm({
      message: confirmMsg,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        deleteUsecase.execute(data.id as string).subscribe({
          next: (_res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: successMsg,
            });

            onDelete();
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
}

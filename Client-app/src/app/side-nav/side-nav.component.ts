import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Tree } from 'primeng/tree';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { AuthService } from '../../Modules/Identity/Identity.Application/auth-service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { UserLogOutUseCase } from '../../Modules/Identity/Identity.Application/usecases/user-logout.usecase';
import { StyleClass } from 'primeng/styleclass';
import { Ripple } from 'primeng/ripple';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  imports: [
    RouterModule,
    CommonModule,
    TranslateModule,
    ButtonModule,
    ToastModule,
    ConfirmDialog,
    StyleClass,
  ],
  providers: [ConfirmationService, MessageService, UserLogOutUseCase],
})
export class SideNavComponent implements OnInit {
  private router = inject(Router);

  private readonly translateService = inject(TranslateService);
  private readonly userLogOutUseCase = inject(UserLogOutUseCase);
  private readonly confirmationService = inject(ConfirmationService);

  public readonly authService = inject(AuthService);
  public activeRoute = signal('');

  constructor() {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.activeRoute.set(event.url.substring(1));
      }
    });
  }

  logout() {
    this.confirmationService.confirm({
      header: this.translateService.instant('SideNav.logout'),
      rejectLabel: this.translateService.instant('General.cancel'),
      message: this.translateService.instant('SideNav.check_logout'),

      icon: 'pi pi-info-circle',

      rejectButtonProps: {
        label: this.translateService.instant('General.cancel'),
        severity: 'secondary',
        variant: 'text',
      },

      acceptButtonProps: {
        label: this.translateService.instant('SideNav.logout'),
        severity: 'danger',
        variant: 'text',
      },

      accept: () => {
        this.userLogOutUseCase.execute().subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
        });
      },
      reject: () => {},
    });
  }
}

import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideNavComponent } from './side-nav/side-nav.component';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { LoginComponent } from '../Modules/Identity/identity.presentation/login/login.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    SideNavComponent,
    HeaderComponent,
    CommonModule,
    LoginComponent,
    DrawerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private router = inject(Router);

  title = 'Claro CMS';

  public showLayout = true;
  public isMobile: boolean = window.innerWidth <= 1024;
  public drawerVisible: boolean = false;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {
    this.router.events.subscribe(() => {
      this.showLayout = localStorage.getItem('authToken') ? true : false;
    });
  }

  toggleDrawer() {
    this.drawerVisible = !this.drawerVisible;
  }
}

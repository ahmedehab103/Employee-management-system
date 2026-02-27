import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ProjectsGetListProviders,
  ProjectsListUseCase,
} from '../../Modules/assetsCrm/assetsCrm.Application/usecases/projects/projectsGetList.usecase';
import {
  AssetslocationGetListProviders,
  AssetslocationListUseCase,
} from '../../Modules/assetsCrm/assetsCrm.Application/usecases/Assetslocation/assetslocationGetList.usecase';
import { Project } from '../../Modules/assetsCrm/assetsCrm.Domain/project';
import { Company } from '../../Modules/assetsCrm/assetsCrm.Domain/company';
import { AssetLocation } from '../../Modules/assetsCrm/assetsCrm.Domain/assetLocation';
import {
  CompaniesGetListProviders,
  CompaniesListUseCase,
} from '../../Modules/assetsCrm/assetsCrm.Application/usecases/company/companiesGetList.usecase';
import { CurrencyPipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { Knob } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { Badge } from 'primeng/badge';
import { Tooltip } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  imports: [
    MatButtonModule,
    MatSidenavModule,
    TranslateModule,
    CurrencyPipe,
    ChartModule,
    Knob,
    FormsModule,
    Badge,
    Tooltip,
    DividerModule,
  ],
  providers: [
    ProjectsGetListProviders,
    AssetslocationGetListProviders,
    CompaniesGetListProviders,
  ],
})
export class AnalyticsComponent implements OnInit {
  public others?: Project = undefined;
  public projects: Project[] = [];
  public companies: Company[] = [];
  public locations: AssetLocation[] = [];
  public chartProjects: Project[] = [];
  public walletBallance: number = 0;
  public totalAssetsNumber: number = 0;
  public totalAssetRevenue: number = 0;

  public data: any;
  public options: any;
  public loading: boolean = true;

  private readonly projectsListUseCase = inject(ProjectsListUseCase);
  private readonly companiesListUseCase = inject(CompaniesListUseCase);
  private readonly assetsLocationListUseCase = inject(
    AssetslocationListUseCase
  );

  private readonly translate = inject(TranslateService);
  private readonly cd = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit() {
    forkJoin([
      this.projectsListUseCase.execute(),
      this.assetsLocationListUseCase.execute(),
      this.companiesListUseCase.execute(),
    ])
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(([projects, locations, companies]) => {
        //Projects handling
        this.projects = projects;
        this.projects.sort((a, b) => b.assetsValue! - a.assetsValue!);

        this.walletBallance = this.projects.reduce(
          (acc, p) => acc + p.assetsValue!,
          0
        );
        this.totalAssetsNumber = this.projects.reduce(
          (acc, p) => acc + p.assetsNumber!,
          0
        );
        this.totalAssetRevenue = this.projects.reduce(
          (acc, p) => acc + p.totalAssetRevenue!,
          0
        );

        this.initChart();

        //Locations handling
        this.locations = locations;
        console.log('📢[analytics.component.ts:106]: locations: ', locations);
        this.locations = this.locations.sort(
          (a, b) => b.assetsValue! - a.assetsValue!
        );

        //Companies handling
        this.companies = companies;
      });
  }

  getProjectPercentage(project: Project) {
    return Math.trunc((project.assetsValue! / this.walletBallance) * 100) + '%';
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.chartProjects = this.projects.slice(0, 4);

    if (this.projects.length > 2)
      this.others = {
        assetsValue: this.projects
          .slice(2)
          .reduce((acc, p) => acc + p.assetsValue!, 0),
        translatedName: this.translate.instant('analytics.others'),
      };

    this.data = {
      labels: this.others
        ? this.chartProjects.concat(this.others).map((p) => p.translatedName)
        : this.chartProjects.map((p) => p.translatedName),
      datasets: [
        {
          data: this.others
            ? this.chartProjects.concat(this.others).map((p) => p.assetsValue)
            : this.chartProjects.map((p) => p.assetsValue),
          backgroundColor: [
            documentStyle.getPropertyValue('--p-cyan-500'),
            documentStyle.getPropertyValue('--p-orange-500'),
            documentStyle.getPropertyValue('--p-gray-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--p-cyan-400'),
            documentStyle.getPropertyValue('--p-orange-400'),
            documentStyle.getPropertyValue('--p-gray-400'),
          ],
        },
      ],
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
    this.cd.markForCheck();
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

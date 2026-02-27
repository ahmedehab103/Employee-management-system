import { Component, inject, OnInit, signal } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { LocalizationService } from '../../Modules/Common/domain/servies/localization-service';
import { LanguageType } from '../../Modules/Common/domain/language';
import {
  AssetGetListProviders,
  AssetsGetListUseCase,
} from '../../Modules/assetsCrm/assetsCrm.Application/usecases/assets/assetsGetList.usecase';
import { Asset } from '../../Modules/assetsCrm/assetsCrm.Domain/asset';
import { PointOnMap } from '../../Modules/assetsCrm/assetsCrm.Domain/pointOnMap';
import { FilterComponent } from '../../Modules/assetsCrm/assetsCrm.presentation/filter/filter.component';
import { Button } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { Company } from '../../Modules/assetsCrm/assetsCrm.Domain/company';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [GoogleMapsModule, FilterComponent, Button, TranslateModule],
  providers: [AssetGetListProviders, DialogService],
})
export class MapComponent implements OnInit {
  options: google.maps.MapOptions = {
    center: { lat: 27.927458, lng: 30.78971 },
    zoom: 7,
  };
  markerPositions: (Asset | null | undefined)[] = [];

  private companies: Company[] = [];

  readonly assetsGetListUseCase = inject(AssetsGetListUseCase);
  private readonly _localizationService: LocalizationService =
    inject(LocalizationService);
  private readonly dialogService = inject(DialogService);
  private lang: any = signal(this._localizationService.getCurrentLang());

  constructor() {}

  ngOnInit() {
    this.assetsGetListUseCase.execute().subscribe((res) => {
      this.companies = res;

      this.markerPositions = this.getAssets();
    });
  }

  private getAssets(
    projectIds?: string[] | null,
    companiesIds?: string[] | null
  ) {
    const companies =
      companiesIds != null || undefined
        ? this.companies.filter((c) => companiesIds?.includes(c.id!))
        : this.companies;

    const projects =
      projectIds != null || undefined
        ? companies
            .flatMap((c) => c.projects)
            .filter((p) => projectIds?.includes(p?.id!))
        : this.companies.flatMap((c) => c.projects);

    return projects.flatMap((c) => c?.assets);
  }

  convertPointsToLatLng(points?: PointOnMap | null) {
    if (!points) return { lat: 0, lng: 0 };
    return { lat: +points.latitude, lng: +points.longitude };
  }

  onMarkerClick(marker: any): void {
    this.dialogService.open(PropertyDetailsComponent, {
      width: '360px',
      modal: true,
      closable: true,
      dismissableMask: true,
      data: marker,
      position: this.lang().name == 'ar' ? 'left' : 'right',
    });

    // Perform your actions here
  }

  onFilter(event: any) {
    this.markerPositions = this.getAssets(
      event.projectsIds,
      event.companiesIds
    );
  }
}

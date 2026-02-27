import { Asset } from './../../../Modules/assetsCrm/assetsCrm.Domain/asset';
import { Component, inject, OnInit, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Button, ButtonModule } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { GalleriaModule } from 'primeng/galleria';
import { Router, RouterModule } from '@angular/router';
import {
  GetShortAssetProviders,
  GetShortAssetUseCase,
} from '../../../Modules/assetsCrm/assetsCrm.Application/usecases/assets/getShortAsset.usecase';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LocalizationService } from '../../../Modules/Common/domain/servies/localization-service';
@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss'],
  imports: [
    ButtonModule,
    CurrencyPipe,
    TranslateModule,
    GalleriaModule,
    RouterModule,
    Button,
  ],
  providers: [GetShortAssetProviders],
})
export class PropertyDetailsComponent implements OnInit {
  private data: Asset;

  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  private router = inject(Router);

  private readonly _getAssetUseCase: GetShortAssetUseCase =
    inject(GetShortAssetUseCase);

  public imageUrlBase: string = environment.imgUrl;
  public images: any[] = [];

  public asset?: Asset;

  constructor() {
    this.data = this.config.data;
  }
  ngOnInit() {
    this._getAssetUseCase.execute(this.data.id!).subscribe((asset) => {
      this.asset = asset;

      this.images =
        asset?.images?.map((item: any) => ({
          itemImageSrc: this.imageUrlBase + item,
        })) ?? [];
    });

    this.router.events.subscribe((res) => {
      this.closeDialog();
    });
  }

  closeDialog(isConfirmed: boolean = false) {
    this.ref.close({ confirmed: isConfirmed });
  }
}

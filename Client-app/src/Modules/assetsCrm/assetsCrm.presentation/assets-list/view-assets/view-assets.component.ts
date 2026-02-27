import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleriaModule } from 'primeng/galleria';
import {
  GetAssetProviders,
  GetAssetUseCase,
} from '../../../assetsCrm.Application/usecases/assets/getAsset.usecase';
import { Asset } from '../../../assetsCrm.Domain/asset';
import { environment } from '../../../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageType } from '../../../../Common/domain/language';
import { LocalizationService } from '../../../../Common/domain/servies/localization-service';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { GoogleMapsModule } from '@angular/google-maps';
import { PointOnMap } from '../../../assetsCrm.Domain/pointOnMap';
import { LocalizedString } from '../../../../Common/domain/localized-string';
import {
  AssetsPostCommentProviders,
  AssetsPostCommentUseCase,
} from '../../../assetsCrm.Application/usecases/assets/assetsPostComment.usecase';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../../assetsCrm.Domain/comment';
import {
  UserGetProviders,
  UserGetUseCase,
} from '../../../../Identity/Identity.Application/usecases/userGet.usecase';
import { User } from '../../../../Identity/Identity.Domain/user';

@Component({
  selector: 'app-view-assets',
  templateUrl: './view-assets.component.html',
  styleUrls: ['./view-assets.component.scss'],
  standalone: true,
  imports: [
    GalleriaModule,
    TranslateModule,
    DividerModule,
    AccordionModule,
    Button,
    Dialog,
    GoogleMapsModule,
    InputTextModule,
    FormsModule,
  ],
  providers: [GetAssetProviders, AssetsPostCommentProviders, UserGetProviders],
})
export class ViewAssetsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userGetUseCase = inject(UserGetUseCase);
  private readonly getAssetUseCase = inject(GetAssetUseCase);
  private readonly assetsPostCommentUseCase = inject(AssetsPostCommentUseCase);
  private readonly _localizationService: LocalizationService =
    inject(LocalizationService);

  private assetId: string = '';
  private user!: User;
  private renderer!: Renderer2;

  public imageUrlBase: string = environment.imgUrl;

  public asset?: Asset;
  public comment: string = '';
  public LanguageType = LanguageType;

  public images?: any[] = [];
  public comments: Comment[] = [];
  public options: google.maps.MapOptions = {};

  public showMap: boolean = false;
  public commentLoading: boolean = false;

  constructor() {}

  ngOnInit() {
    this.assetId = this.route.snapshot.params['id'];

    this.getAssetUseCase.execute(this.assetId).subscribe((response) => {
      this.asset = response;
      this.images = this.asset?.images!;
      this.comments = this.asset?.comments!;
      this.images = this.asset.images?.map(
        (item: any) => this.imageUrlBase + 'Picture/' + item
      );

      if (this.asset.pointOnMap)
        this.options.center = {
          lat: +this.asset.pointOnMap.latitude,
          lng: +this.asset.pointOnMap.longitude,
        };
    });

    this.userGetUseCase
      .execute()
      .subscribe((response) => (this.user = response));
  }
  getTranslated(text?: LocalizedString | null) {
    return LocalizedString.getString(text);
  }

  convertPointsToLatLng(points?: PointOnMap | null) {
    if (!points) return { lat: 0, lng: 0 };
    return { lat: +points.latitude, lng: +points.longitude };
  }

  postComment() {
    this.commentLoading = true;
    this.assetsPostCommentUseCase
      .execute({ assetId: this.assetId, comment: this.comment })
      .subscribe(() => {
        this.commentLoading = false;
        const comment: Comment = {
          commentId: 'new',
          text: this.comment,
          username: '',
          userEmail: this.user.email!,
          isResolve: false,
          createAt: new Date(),
        };
        this.comments.push(comment);
        setTimeout(() => this.scrollToComment(comment.commentId), 100);
        this.comment = '';
      });
  }

  private scrollToComment(commentId: string) {
    const c = document.getElementById(commentId);
    if (c) {
      c.scrollIntoView();
      // this.renderer?.addClass(c, 'bg-black');
      c.classList.add('highlight');

      setTimeout(() => {
        // this.renderer?.removeClass(c, 'bg-black');
        c.classList.remove('highlight');
      }, 1000); // Remove the highlight class after 1 second
    }
  }
}

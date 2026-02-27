import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { AssetLocation } from '../../../assetsCrm.Domain/assetLocation';
import { Project } from '../../../assetsCrm.Domain/project';
import {
  ProjectsGetLookUpProviders,
  ProjectsGetLookUpUseCase,
} from '../../../assetsCrm.Application/usecases/projects/projectsGetLookUp.usecase';
import { MessageService } from 'primeng/api';
import {
  AssetsImagePostProviders,
  AssetsImagePostUseCase,
} from '../../../assetsCrm.Application/usecases/assets/assetsImagePost.usecase';
import { Asset } from '../../../assetsCrm.Domain/asset';
import {
  AssetsPostProviders,
  AssetsPostUseCase,
} from '../../../assetsCrm.Application/usecases/assets/assetsPost.usecase';
import {
  AssetsPutProviders,
  AssetsPutUseCase,
} from '../../../assetsCrm.Application/usecases/assets/assetsPut.usecase';
import {
  AssetsLocationGetLookUpProviders,
  AssetsLocationGetLookUpUseCase,
} from '../../../assetsCrm.Application/usecases/Assetslocation/assetsLocationGetLookUp.usecase';
import { LocalizedString } from '../../../../Common/domain/localized-string';
import { finalize } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Popover } from 'primeng/popover';
import { InputGroup } from 'primeng/inputgroup';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-create-update-assets',
  templateUrl: './create-update-assets.component.html',
  styleUrls: ['./create-update-assets.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    Button,
    InputTextModule,
    TextareaModule,
    SelectModule,
    InputGroup,
    InputGroupAddon,
    Popover,
    GoogleMapsModule,
  ],
  providers: [
    AssetsLocationGetLookUpProviders,
    ProjectsGetLookUpProviders,
    AssetsImagePostProviders,
    AssetsPostProviders,
    AssetsPutProviders,
    MessageService,
  ],
})
export class CreateUpdateDialogComponent implements OnInit, AfterViewInit {
  private form: FormGroup;

  public uploadedImages: any[] = [];

  public imagesLoading: boolean = false;

  public data: Asset;
  public markerPosition: any;
  public loading: boolean = false;
  public projects: Project[] = [];
  public submitted: boolean = false;
  public locations: AssetLocation[] = [];
  public marker: { position: google.maps.LatLngLiteral } | null = {
    position: { lat: 37.7749, lng: -122.4194 },
  };

  private readonly assetsImagePostUseCase = inject(AssetsImagePostUseCase);
  private readonly projectsGetLookUpUseCase = inject(ProjectsGetLookUpUseCase);
  private readonly assetsLocationGetLookUpUseCase = inject(
    AssetsLocationGetLookUpUseCase
  );

  public imageUrlBase: string = environment.imgUrl;

  public options: google.maps.MapOptions = {
    center: { lat: 30.111052, lng: 31.335482 },
    zoom: 10,
  };

  public readonly ref = inject(DynamicDialogRef);
  public readonly config = inject(DynamicDialogConfig);
  public readonly assetsPostUseCase = inject(AssetsPostUseCase);
  public readonly assetsPutUseCase = inject(AssetsPutUseCase);

  constructor() {
    this.data = this.config.data;

    this.uploadedImages = this.data?.images ?? [];

    this.form = new FormGroup({
      name: new FormGroup({
        Ar: new FormControl(this.data?.name?.ar ?? '', Validators.required),
        En: new FormControl(this.data?.name?.en ?? '', Validators.required),
      }),
      description: new FormGroup({
        Ar: new FormControl(
          this.data?.description?.ar ?? '',
          Validators.required
        ),
        En: new FormControl(
          this.data?.description?.en ?? '',
          Validators.required
        ),
      }),
      pointOnMap: new FormGroup({
        longitude: new FormControl(this.data?.pointOnMap?.longitude ?? ''),
        latitude: new FormControl(this.data?.pointOnMap?.latitude ?? ''),
      }),
      locationId: new FormControl(
        this.data?.location ?? '',
        Validators.required
      ),
      projectId: new FormControl(this.data?.project ?? '', Validators.required),
      images: new FormControl(this.uploadedImages),
    });
  }

  get arName(): FormControl {
    return this.form.get('name.Ar') as FormControl;
  }

  get enName(): FormControl {
    return this.form.get('name.En') as FormControl;
  }

  get arDescription(): FormControl {
    return this.form.get('description.Ar') as FormControl;
  }

  get enDescription(): FormControl {
    return this.form.get('description.En') as FormControl;
  }

  get longitude(): FormControl {
    return this.form.get('pointOnMap.longitude') as FormControl;
  }

  get latitude(): FormControl {
    return this.form.get('pointOnMap.latitude') as FormControl;
  }

  get locationId(): FormControl {
    return this.form.get('locationId') as FormControl;
  }

  get projectId(): FormControl {
    return this.form.get('projectId') as FormControl;
  }

  get images(): FormControl {
    return this.form.get('images') as FormControl;
  }
  @ViewChild('myDialog') dialog!: ElementRef;

  ngAfterViewInit() {
    const selectBox = this.dialog.nativeElement.querySelector(
      '.dialog-dropdown .p-dropdown'
    );
    const dropdownPanels = document.querySelectorAll(
      '.dialog-dropdown .p-dropdown-panel'
    );
    dropdownPanels.forEach((panel) => {
      (panel as HTMLElement).style.width = `${selectBox.offsetWidth}px`;
    });
  }

  ngOnInit() {
    this.projectsGetLookUpUseCase.execute().subscribe((response) => {
      this.projects = response;
    });

    this.assetsLocationGetLookUpUseCase.execute().subscribe((response) => {
      this.locations = response;
    });

    this.changeMarker();
  }

  changeMarker() {
    this.latitude.valueChanges.subscribe((value) => {
      this.markerPosition = {
        lat: value,
        lng: this.longitude.value,
      };
    });
    this.longitude.valueChanges.subscribe((value) => {
      this.markerPosition = {
        lat: this.latitude.value,
        lng: value,
      };
    });
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.marker = {
        position: event.latLng.toJSON(),
      };

      this.markerPosition = this.marker?.position;

      this.latitude.setValue(this.marker.position.lat);
      this.longitude.setValue(this.marker.position.lng);
    }
  }

  onSelectedFiles(event: any) {
    const input = event.target as HTMLInputElement;

    if (input?.files) {
      Array.from(input.files).forEach((file) => {
        this.imagesLoading = true;
        this.assetsImagePostUseCase.execute(file).subscribe((response: any) => {
          this.uploadedImages.push(response.result);
          this.imagesLoading = false;
          const reader = new FileReader();

          reader.readAsDataURL(file);
        });
      });
    }
  }

  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
  }

  submit() {
    this.loading = true;
    this.submitted = true;

    const asset: Asset = {
      name: new LocalizedString(this.arName.value, this.enName.value),
      description: new LocalizedString(
        this.arDescription.value,
        this.enDescription.value
      ),
      pointOnMap: {
        longitude: this.longitude.value,
        latitude: this.latitude.value,
      },
      location: this.locationId.value,
      project: this.projectId.value,
      images: this.uploadedImages,
      id: this.data?.id,
      comments: [],
    };

    if (this.data?.id) {
      this.update(asset);
    } else {
      this.create(asset);
    }
  }

  create(asset: Asset) {
    this.assetsPostUseCase
      .execute(asset)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.closeDialog(true);
        },
        error: (err) => {
          this.handleError(err, this.form);
        },
      });
  }

  update(asset: Asset) {
    this.assetsPutUseCase
      .execute(asset)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.closeDialog(true);
        },
        error: (err) => {
          this.handleError(err, this.form);
        },
      });
  }

  handleError(err: any, form: FormGroup) {
    if (err.status == 422) {
      Object.entries(err.error.errors).forEach(([key, value]) => {
        form.get(key)?.setErrors({ serverError: value });
      });
    }
  }
  closeDialog(isConfirmed: boolean = false) {
    this.ref.close({ confirmed: isConfirmed });
  }
}

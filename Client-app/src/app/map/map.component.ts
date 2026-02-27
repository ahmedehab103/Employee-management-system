import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [GoogleMapsModule],
})
export class MapComponent {
  options: google.maps.MapOptions = {
    center: { lat: 27.927458, lng: 30.78971 },
    zoom: 7,
  };
}

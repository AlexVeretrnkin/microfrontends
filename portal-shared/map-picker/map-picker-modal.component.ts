import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { CoordinatesModel } from '@models';

@Component({
  selector: 'app-map-picker',
  templateUrl: './map-picker-modal.component.html',
  styleUrls: ['./map-picker-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapPickerModalComponent implements OnInit {
  @Input() public coordinates!: CoordinatesModel;

  public readonly defaultCenter: google.maps.LatLngLiteral = {
    lat: 50.449118,
    lng: 30.465358
  };

  public chosenPosition: google.maps.LatLngLiteral = {
    lat: 50.449118,
    lng: 30.465358
  };

  constructor(
    private modalRef: BsModalRef
  ) { }

  public ngOnInit(): void {
    if (this.coordinates.longitude && this.coordinates.latitude) {
      this.chosenPosition = {
        lat: this.coordinates.latitude,
        lng: this.coordinates.longitude
      };
    }
  }

  public setMarker(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent): void {
    this.chosenPosition = event.latLng.toJSON();
  }

  public close(): void {
    this.modalRef.hide();
  }

  public action(): void {
    this.modalRef.onHidden.emit(new CoordinatesModel({
      ...this.coordinates,
      latitude: this.chosenPosition.lat,
      longitude: this.chosenPosition.lng,
    }));

    this.close();
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-map-viewer-modal',
  templateUrl: './map-viewer-modal.component.html',
  styleUrls: ['./map-viewer-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapViewerModalComponent {
  @Input() public coordinates!: google.maps.LatLng;

  constructor(
    private modalRef: BsModalRef
  ) { }

  public close(): void {
    this.modalRef.hide();
  }
}

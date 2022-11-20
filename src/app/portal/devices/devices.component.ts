import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { devicesActions } from '@actions';
import { DeviceModelOld, StoreModel } from '@models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesComponent implements OnInit {
  public devices$!: Observable<DeviceModelOld[]>;

  constructor(
    private store: Store<StoreModel>
  ) { }

  public ngOnInit(): void {
    this.devices$ = this.store.select('devices');

    this.store.dispatch(devicesActions.getDevices(null!));
  }

}

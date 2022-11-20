import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DeviceModelOld } from '@models';

@Component({
  selector: 'app-devices-item',
  templateUrl: './devices-item.component.html',
  styleUrls: [
    '../devices.component.scss',
    './devices-item.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesItemComponent {
  @Input() public device!: DeviceModelOld;
}

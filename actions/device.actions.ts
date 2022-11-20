import { createAction, props } from '@ngrx/store';

import { DeviceModelOld } from '@models';

const getDevices = createAction(
  '[Devices] Get',
  props<{ devices: DeviceModelOld[] }>()
);

export const devicesActions = {
  getDevices
};

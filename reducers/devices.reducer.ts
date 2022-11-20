import { createReducer, on } from '@ngrx/store';

import { TypedAction } from '@ngrx/store/src/models';

import { DeviceModelOld } from '@models';

import { devicesActions } from '@actions';

const initialState: DeviceModelOld[] = null!;

const _devicesReducer = createReducer(
  initialState,
  on(
    devicesActions.getDevices,
    (state: DeviceModelOld[], payload: { devices: DeviceModelOld[] }) => payload.devices ? [...payload.devices] : null!
  )
);

export function devicesReducer(state: DeviceModelOld[], action: TypedAction<string>): DeviceModelOld[] {
  return _devicesReducer(state, action);
}

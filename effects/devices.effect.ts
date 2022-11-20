import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';

import { Action } from '@ngrx/store';

import { Observable } from 'rxjs';
import { exhaustMap, filter, map } from 'rxjs/operators';

import { DeviceModelOld } from '@models';

import { MetersService } from '@core';
import { devicesActions } from '@actions';

@Injectable()
export class DevicesEffects {
  constructor(
    private actions$: Actions
  ) {
  }
  public devices$: Observable<Action> & CreateEffectMetadata = createEffect(() =>
    this.actions$.pipe(
      ofType(devicesActions.getDevices),
      filter((action) => !action.devices),
      exhaustMap(() => []),
      map((devices: DeviceModelOld[]) => devicesActions.getDevices({devices}))
    )
  );
}

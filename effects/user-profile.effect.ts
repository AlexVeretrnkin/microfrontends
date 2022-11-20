import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';

import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { StoreModel, UserProfileModel } from '@models';
import { UserProfileService } from '@core';
import { userProfileActions } from '@actions';

@Injectable()
export class UserProfileEffect {
  constructor(
    private actions$: Actions,
    private userProfileService: UserProfileService,
    private store: Store<StoreModel>
  ) {
  }
  public userProfile$: Observable<Action> & CreateEffectMetadata = createEffect(() =>
    this.actions$.pipe(
      ofType(userProfileActions.getUserProfile),
      switchMap(_ => this.userProfileService.getUser()),
      map((userProfile: UserProfileModel) => userProfileActions.setUserProfile(userProfile))
    )
  );
}

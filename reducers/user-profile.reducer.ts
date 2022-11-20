import { UserProfileModel } from '@models';
import { createReducer, on } from '@ngrx/store';
import { userProfileActions } from '@actions';
import { TypedAction } from '@ngrx/store/src/models';

const initState: UserProfileModel = new UserProfileModel();

const _userProfileReducer = createReducer(
  initState,
  on(
    userProfileActions.setUserProfile,
    (state: UserProfileModel, payload: UserProfileModel) => (payload?.id ? {...payload!} : {...state})
  )
);

export function userProfileReducer(state: UserProfileModel, action: TypedAction<string>): UserProfileModel {
  return _userProfileReducer(state, action);
}

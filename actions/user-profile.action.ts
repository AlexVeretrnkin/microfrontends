import { createAction, props } from '@ngrx/store';
import { UserProfileModel } from '@models';

const getUserProfile = createAction(
  '[UserProfile] Get',
  (userProfile?: UserProfileModel) => ( userProfile ?? {...userProfile!})
);

const setUserProfile = createAction(
  '[UserProfile] Set',
  (userProfile?: UserProfileModel) => ( userProfile ?? {...userProfile!})
);


export const userProfileActions = {
  getUserProfile,
  setUserProfile
};

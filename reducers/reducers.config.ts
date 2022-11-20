import { ActionReducerMap } from '@ngrx/store';

import { devicesReducer } from './devices.reducer';
import { navigationBarReducer } from './navigation-bar.reducer';
import { userProfileReducer } from './user-profile.reducer';
import { tablesReducer } from './tables.reducer';

export const reducersConfig: ActionReducerMap<any, any> = {
  devices: devicesReducer,
  navigationBar: navigationBarReducer,
  userProfile: userProfileReducer,
  tables: tablesReducer
};

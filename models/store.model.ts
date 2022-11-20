import { UserModel } from './userModel';
import { DeviceModelOld } from './devices/deviceModelOld';
import { NavigationBarModel } from './navigation-bar/navigation-bar.model';
import { UserProfileModel } from './user/user-profile.model';
import { TableStateModel } from './table/table-state.model';

export interface StoreModel {
  count: {test: number};
  user: UserModel;
  devices: DeviceModelOld[];
  navigationBar: NavigationBarModel;
  userProfile: UserProfileModel;
  tables: TableStateModel;
}

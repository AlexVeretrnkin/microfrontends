import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MetersService } from './devices/meters.service';
import { NavigationBarService } from './navigation-bar/navigation-bar.service';
import { UserProfileService } from './user-profile/user-profile.service';
import { ManageUsersService } from './manage-users/manage-users.service';
import { FormsService } from './forms/forms.service';
import { TableService } from './table/table.service';
import { ClipboardService } from './clipboard/clipboard.service';
import { LocationsService } from './locations/locations.service';
import { BuildingService } from './buillding/building.service';
import { RoomsService } from './rooms/rooms.service';
import { DocumentsService } from './documents/documents.service';
import { FileHelperService } from './helpers/file-helper/file-helper.service';
import { ContractsService } from './contracts/contracts.service';
import { FloorService } from './floor/floor.service';
import { GroupsService } from './groups/groups.service';
import { TariffService } from './tariff/tariff.service';
import { SnapshotService } from './snapshot/snapshot.service';
import { PermissionGuard } from './permission-guard/permission.guard';
import { EnvironmentalReadingService } from './environmental-reading/environmental-reading.service';

@NgModule(
  {
    imports: [
      CommonModule,
    ],
    providers: [
      MetersService,
      NavigationBarService,
      UserProfileService,
      ManageUsersService,
      FormsService,
      TableService,
      ClipboardService,
      LocationsService,
      BuildingService,
      RoomsService,
      DocumentsService,
      FileHelperService,
      ContractsService,
      FloorService,
      GroupsService,
      TariffService,
      SnapshotService,
      PermissionGuard,
      EnvironmentalReadingService
    ]
  })
export class CoreModule {
}

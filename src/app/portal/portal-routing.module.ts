import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoutesEnum } from '../routes.enum';

import { PortalComponent } from './portal.component';
import { DevicesComponent } from './devices/devices.component';
import { ChartsComponent } from './charts/charts.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ContentContainerComponent } from './content-container/content-container.component';
import { SecurityComponent } from './user/security/security.component';
import { ManageUsersComponent } from './manage/manage-users/manage-users.component';
import { ManageInvitesComponent } from './manage/manage-invites/manage-invites.component';
import { ManageLocationsComponent } from './manage/manage-locations/manage-locations.component';
import { ManageBuildingTypesComponent } from './manage/manage-building-types/manage-building-types.component';
import { ManageBuildingsComponent } from './manage/manage-buildings/manage-buildings.component';
import { ManageRoomsComponent } from './manage/manage-rooms/manage-rooms.component';
import { DocumentationComponent } from './main/documentation/documentation.component';
import { ManageMetersComponent } from './manage/manage-meters/manage-meters.component';
import { SupplyContractsComponent } from './main/supply-contracts/supply-contracts.component';
import { OverviewComponent } from './main/overview/overview.component';
import { ManageFloorsComponent } from './manage/manage-floors/manage-floors.component';
import { AdditionalComponent } from './user/additional/additional.component';
import { ManageGroupsComponent } from './manage/manage-groups/manage-groups.component';
import { TariffsComponent } from './main/tariffs/tariffs.component';
import { MeterComponent } from './manage/manage-meters/meter/meter.component';
import { MeterGeneralComponent } from './manage/manage-meters/meter/meter-general/meter-general.component';
import { MeterSnapshotsComponent } from './manage/manage-meters/meter/meter-snapshots/meter-snapshots.component';
import { FloorComponent } from './manage/manage-floors/floor/floor.component';
import { FloorGeneralComponent } from './manage/manage-floors/floor/floor-general/floor-general.component';
import { FloorRoomsComponent } from './manage/manage-floors/floor/floor-rooms/floor-rooms.component';
import { GroupComponent } from './manage/manage-groups/group/group.component';
import { GroupMembersComponent } from './manage/manage-groups/group/group-members/group-members.component';
import { GroupRightsComponent } from './manage/manage-groups/group/group-rights/group-rights.component';
import { GroupSubordinatesComponent } from './manage/manage-groups/group/group-subordinates/group-subordinates.component';
import { PermissionGuard } from '@core';
import { RoomComponent } from './manage/manage-rooms/room/room.component';
import { RoomGeneralComponent } from './manage/manage-rooms/room/room-general/room-general.component';
import { RoomEnvironmentalReadingsComponent } from './manage/manage-rooms/room/room-environmental-readings/room-environmental-readings.component';
import { BuildingComponent } from './manage/manage-buildings/building/building.component';
import { BuildingGeneralComponent } from './manage/manage-buildings/building/building-general/building-general.component';
import { BuildingRoomsComponent } from './manage/manage-buildings/building/building-rooms/building-rooms.component';
import { BuildingFloorsComponent } from './manage/manage-buildings/building/building-floors/building-floors.component';

const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      {
        path: RoutesEnum.main,
        component: ContentContainerComponent,
        canActivateChild: [PermissionGuard],
        children: [
          {
            path: RoutesEnum.mainOverview,
            component: OverviewComponent,
          },
          {
            path: RoutesEnum.mainDocumentation,
            component: DocumentationComponent,
          },
          {
            path: RoutesEnum.mainSupplyContracts,
            component: SupplyContractsComponent,
          },
          {
            path: RoutesEnum.mainTariffs,
            component: TariffsComponent,
          },
          {
            path: RoutesEnum.dashboardPieCharts,
            component: ChartsComponent,
          },
          {
            path: RoutesEnum.dashboardTableCharts,
            component: ChartsComponent,
          },
          {
            path: RoutesEnum.mainDocumentation,
            component: DevicesComponent,
          },
          {path: '**', redirectTo: RoutesEnum.mainOverview}
        ]
      },
      {
        path: RoutesEnum.manage,
        component: ContentContainerComponent,
        canActivateChild: [PermissionGuard],
        children: [
          {
            path: RoutesEnum.manageLocations,
            component: ManageLocationsComponent,
          },
          {
            path: RoutesEnum.manageMeters,
            component: ManageMetersComponent,
          },
          {
            path: `${RoutesEnum.manageMeters}/:${RoutesEnum.manageMeterId}`,
            component: MeterComponent,
            children: [
              {
                path: RoutesEnum.manageMeterGeneral,
                component: MeterGeneralComponent
              },
              {
                path: RoutesEnum.manageMeterReadings,
                component: MeterSnapshotsComponent
              },
              {path: '**', redirectTo: RoutesEnum.manageMeterGeneral}
            ]
          },
          {
            path: RoutesEnum.manageBuildingType,
            component: ManageBuildingTypesComponent,
          },
          {
            path: RoutesEnum.manageBuildings,
            component: ManageBuildingsComponent,
          },
          {
            path: `${RoutesEnum.manageBuildings}/:${RoutesEnum.manageBuildingId}`,
            component: BuildingComponent,
            children: [
              {
                path: RoutesEnum.manageBuildingGeneral,
                component: BuildingGeneralComponent
              },
              {
                path: RoutesEnum.manageBuildingRooms,
                component: BuildingRoomsComponent
              },
              {
                path: RoutesEnum.manageBuildingFloors,
                component: BuildingFloorsComponent
              },
              {path: '**', redirectTo: RoutesEnum.manageBuildingGeneral}
            ]
          },
          {
            path: RoutesEnum.manageFloors,
            component: ManageFloorsComponent,
          },
          {
            path: `${RoutesEnum.manageFloors}/:${RoutesEnum.manageFloorId}`,
            component: FloorComponent,
            children: [
              {
                path: RoutesEnum.manageFloorGeneral,
                component: FloorGeneralComponent
              },
              {
                path: RoutesEnum.manageFloorRooms,
                component: FloorRoomsComponent
              },
              {path: '**', redirectTo: RoutesEnum.manageFloorGeneral}
            ]
          },
          {
            path: RoutesEnum.manageRooms,
            component: ManageRoomsComponent,
          },
          {
            path: `${RoutesEnum.manageRooms}/:${RoutesEnum.manageRoomId}`,
            component: RoomComponent,
            children: [
              {
                path: RoutesEnum.manageRoomGeneral,
                component: RoomGeneralComponent
              },
              {
                path: RoutesEnum.manageRoomEnvironmentalReadings,
                component: RoomEnvironmentalReadingsComponent
              },
              {path: '**', redirectTo: RoutesEnum.manageRoomGeneral}
            ]
          },
          {
            path: RoutesEnum.manageGroups,
            component: ManageGroupsComponent,
          },
          {
            path: `${RoutesEnum.manageGroups}/:${RoutesEnum.manageGroupId}`,
            component: GroupComponent,
            children: [
              {
                path: RoutesEnum.manageGroupMembers,
                component: GroupMembersComponent
              },
              {
                path: RoutesEnum.manageGroupRights,
                component: GroupRightsComponent
              },
              {
                path: RoutesEnum.manageGroupSubordinates,
                component: GroupSubordinatesComponent
              },
              {path: '**', redirectTo: RoutesEnum.manageGroupMembers}
            ]
          },
          {
            path: RoutesEnum.manageUsers,
            component: ManageUsersComponent,
          },
          {
            path: RoutesEnum.manageInvitedUsers,
            component: ManageInvitesComponent,
          },
          {path: '**', redirectTo: RoutesEnum.manageUsers}
        ]
      },
      {
        path: RoutesEnum.user,
        component: ContentContainerComponent,
        children: [
          {
            path: RoutesEnum.userProfile,
            component: ProfileComponent,
          },
          {
            path: RoutesEnum.userGroups,
            component: ProfileComponent,
          },
          {
            path: RoutesEnum.userSecurity,
            component: SecurityComponent,
          },
          {
            path: RoutesEnum.userAdditional,
            component: AdditionalComponent,
          },
          {path: '**', redirectTo: RoutesEnum.userProfile}
        ]
      },
      {path: '**', redirectTo: RoutesEnum.user},
    ]
  },
  {path: '**', redirectTo: RoutesEnum.main}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule {
}

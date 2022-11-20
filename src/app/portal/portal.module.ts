import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxEchartsModule } from 'ngx-echarts';

import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { PortalRoutingModule } from './portal-routing.module';
import { PortalComponent } from './portal.component';
import { SubNavigationComponent } from './sub-navigation/sub-navigation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DevicesComponent } from './devices/devices.component';
import { ChartsComponent } from './charts/charts.component';
import { DevicesItemComponent } from './devices/devices-item/devices-item.component';
import { CoreModule } from '@core';
import { EffectsModule } from '@ngrx/effects';
import { DevicesEffects, UserProfileEffect, TablesEffects } from '@effects';
import { StoreModule } from '@ngrx/store';
import { reducersConfig } from '@reducers';

import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { ProfileComponent } from './user/profile/profile.component';
import { SharedModule } from '@shared';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContentContainerComponent } from './content-container/content-container.component';
import { SecurityComponent } from './user/security/security.component';
import { SessionItemComponent } from './user/security/session-item/session-item.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PortalSharedModule } from '@portal-shared';
import { ManageUsersComponent } from './manage/manage-users/manage-users.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ManageInvitesComponent } from './manage/manage-invites/manage-invites.component';
import { ManageLocationsComponent } from './manage/manage-locations/manage-locations.component';
import { ManageBuildingTypesComponent } from './manage/manage-building-types/manage-building-types.component';
import { ManageBuildingsComponent } from './manage/manage-buildings/manage-buildings.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ManageRoomsComponent } from './manage/manage-rooms/manage-rooms.component';
import { DocumentationComponent } from './main/documentation/documentation.component';
import { ManageMetersComponent } from './manage/manage-meters/manage-meters.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SupplyContractsComponent } from './main/supply-contracts/supply-contracts.component';
import { OverviewComponent } from './main/overview/overview.component';
import { ManageFloorsComponent } from './manage/manage-floors/manage-floors.component';
import { AdditionalComponent } from './user/additional/additional.component';
import { ManageGroupsComponent } from './manage/manage-groups/manage-groups.component';
import { SortableModule } from 'ngx-bootstrap/sortable';
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
import { GroupPermissionsModalComponent } from './manage/manage-groups/group/group-permissions-modal/group-permissions-modal.component';
import { RoomComponent } from './manage/manage-rooms/room/room.component';
import { RoomGeneralComponent } from './manage/manage-rooms/room/room-general/room-general.component';
import { RoomEnvironmentalReadingsComponent } from './manage/manage-rooms/room/room-environmental-readings/room-environmental-readings.component';
import { BuildingComponent } from './manage/manage-buildings/building/building.component';
import { BuildingGeneralComponent } from './manage/manage-buildings/building/building-general/building-general.component';
import { BuildingRoomsComponent } from './manage/manage-buildings/building/building-rooms/building-rooms.component';
import { BuildingFloorsComponent } from './manage/manage-buildings/building/building-floors/building-floors.component';

echarts.use([
  SVGRenderer,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  LegendComponent
]);

@NgModule({
  declarations: [
    PortalComponent,
    MainNavigationComponent,
    SubNavigationComponent,
    DashboardComponent,
    DevicesComponent,
    ChartsComponent,
    DevicesItemComponent,
    ProfileComponent,
    ContentContainerComponent,
    SecurityComponent,
    SessionItemComponent,
    ManageUsersComponent,
    ManageInvitesComponent,
    ManageLocationsComponent,
    ManageBuildingTypesComponent,
    ManageBuildingsComponent,
    ManageRoomsComponent,
    DocumentationComponent,
    ManageMetersComponent,
    SupplyContractsComponent,
    OverviewComponent,
    ManageFloorsComponent,
    AdditionalComponent,
    ManageGroupsComponent,
    TariffsComponent,
    MeterComponent,
    MeterGeneralComponent,
    MeterSnapshotsComponent,
    FloorComponent,
    FloorGeneralComponent,
    FloorRoomsComponent,
    GroupComponent,
    GroupMembersComponent,
    GroupRightsComponent,
    GroupSubordinatesComponent,
    GroupPermissionsModalComponent,
    RoomComponent,
    RoomGeneralComponent,
    RoomEnvironmentalReadingsComponent,
    BuildingComponent,
    BuildingGeneralComponent,
    BuildingRoomsComponent,
    BuildingFloorsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PortalRoutingModule,

    CoreModule,

    SharedModule,
    PortalSharedModule,

    StoreModule.forRoot(reducersConfig),
    EffectsModule.forRoot([
      DevicesEffects,
      UserProfileEffect,
      TablesEffects
    ]),

    IconSpriteModule,
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxEchartsModule.forRoot({echarts}),
    TranslateModule.forChild(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    SortableModule.forRoot(),
  ]
})
export class PortalModule {
}

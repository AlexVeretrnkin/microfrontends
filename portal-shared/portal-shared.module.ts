import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { SharedModule } from '@shared';

import { BasicTableComponent } from './basic-table/basic-table.component';
import { BasicTableItemComponent } from './basic-table/basic-table-item/basic-table-item.component';
import { ModalInputComponent } from './modal-input/modal-input.component';
import { ExtendedInputModalComponent } from './extednded-input-modal/extended-input-modal.component';
import { FieldGroupComponent } from './field-group/field-group.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { SelectInputComponent } from './select-input/select-input.component';
import { SafePipe } from './pipes/safe/safe.pipe';
import { InputModalComponent } from './input-modal/input-modal.component';
import { MapPickerModalComponent } from './map-picker/map-picker-modal.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapViewerModalComponent } from './map-viewer-modal/map-viewer-modal.component';
import { TypeheadComponent } from './typehead/typehead.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { DatePickComponent } from './date-pick/date-pick.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ClickOutsideDirective } from './directives/click-outside/click-outside.directive';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { ExportModalComponent } from './export-modal/export-modal.component';
import { SortableModule } from 'ngx-bootstrap/sortable';

@NgModule({
  declarations: [
    BasicTableComponent,
    BasicTableItemComponent,
    ModalInputComponent,
    ExtendedInputModalComponent,
    FieldGroupComponent,
    ContactInfoComponent,
    SelectInputComponent,
    SafePipe,
    InputModalComponent,
    MapPickerModalComponent,
    MapViewerModalComponent,
    TypeheadComponent,
    DatePickComponent,
    ClickOutsideDirective,
    DeleteModalComponent,
    ExportModalComponent
  ],
  imports: [
    CommonModule,
    IconSpriteModule,
    SharedModule,
    TranslateModule,
    ReactiveFormsModule,
    BsDropdownModule,
    GoogleMapsModule,
    TypeaheadModule,
    FormsModule,
    BsDatepickerModule,
    TimepickerModule,
    SortableModule
  ],
  exports: [
    BasicTableComponent,
    ModalInputComponent,
    ExtendedInputModalComponent,
    FieldGroupComponent,
    ContactInfoComponent,
    SelectInputComponent,
    SafePipe,
    MapPickerModalComponent,
    MapViewerModalComponent,
    TypeheadComponent,
    DatePickComponent,
    ClickOutsideDirective,
    DeleteModalComponent,
    ExportModalComponent
  ]
})
export class PortalSharedModule {
}

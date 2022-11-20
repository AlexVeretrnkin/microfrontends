import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnimatedCheckboxComponent } from './animated-checkbox/animated-checkbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormErrorsPipe } from './form-errors-pipe/form-errors.pipe';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { YesNoModalComponent } from './yes-no-modal/yes-no-modal.component';

@NgModule({
  declarations: [AnimatedCheckboxComponent, FormErrorsPipe, YesNoModalComponent],
  exports: [
    AnimatedCheckboxComponent,
    FormErrorsPipe,
    YesNoModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule
  ],
  providers: [
    TranslatePipe
  ]
})
export class SharedModule {
}

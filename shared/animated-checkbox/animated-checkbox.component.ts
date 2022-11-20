import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { AnimatedCheckboxModel } from '@models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-animated-checkbox',
  templateUrl: './animated-checkbox.component.html',
  styleUrls: ['./animated-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimatedCheckboxComponent {
  @Input() isControlChecked = false;

  @Input() formControlName!: string;

  @Input() checkBoxFormControl!: FormControl;

  @Input() checkBoxId = 'cb';

  @Input() style!: string;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectInputComponent {
  @Input() public selectControl!: FormControl;
  @Input() public selections!: string[];
  @Input() public defaultText = 'Оберіть тип';
  @Input() public isIconShown = true;

  public choseContactType(type: string): void {
    this.selectControl.patchValue(type);
  }
}

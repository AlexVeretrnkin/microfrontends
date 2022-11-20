import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SessionInfoModel } from '@models';

@Component({
  selector: 'app-session-item',
  templateUrl: './session-item.component.html',
  styleUrls: [
    '../security.component.scss',
    './session-item.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionItemComponent implements OnInit {
  @Input() session!: SessionInfoModel;

  @Input() justTest!: boolean;

  constructor() { }

  public ngOnInit(): void {
  }

  public open(): void {
    this.justTest = !this.justTest;
  }
}

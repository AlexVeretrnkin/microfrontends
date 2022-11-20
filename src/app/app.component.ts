import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'management-panel';

  constructor(translate: TranslateService) {
    translate.setDefaultLang('ua');
  }
}

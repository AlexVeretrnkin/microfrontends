import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, ukLocale } from 'ngx-bootstrap/chronos';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-date-pick',
  templateUrl: './date-pick.component.html',
  styleUrls: ['./date-pick.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickComponent implements OnInit {
  @Input() control: FormControl = new FormControl();

  public bsInlineValue: Date = new Date();

  public isOpen = false;

  constructor(
    private localeService: BsLocaleService
  ) {
  }

  public ngOnInit(): void {
    defineLocale('uk', ukLocale);

    this.localeService.use('uk');
  }

  public setDate(event: Date): void {
    const newDate: Date = new Date(this.control.value);

    this.bsInlineValue = event;

    newDate.setFullYear(event.getFullYear());
    newDate.setMonth(event.getMonth());
    newDate.setDate(event.getDate());

    this.control.setValue(newDate.toISOString());
  }

  public toggleCalendar(): void {
    this.isOpen = !this.isOpen;
  }

  public close(): void {
    this.isOpen = false;
  }
}

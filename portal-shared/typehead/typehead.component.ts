import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, ObservableInput, Subscriber } from 'rxjs';
import { FormControl } from '@angular/forms';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-typehead',
  templateUrl: './typehead.component.html',
  styleUrls: ['./typehead.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeheadComponent<D> implements OnInit {
  @Input() public control!: FormControl;
  @Input() public nameOfControl!: string;
  @Input() public selections$!: Observable<D[]>;
  @Input() public searchField!: keyof D;
  @Input() public targetSelectionFieldName!: keyof D;

  @Output() public selectItem: EventEmitter<KeyValue<string, D>> = new EventEmitter<KeyValue<string, D>>();

  public dataSource$!: Observable<Observable<D[]> extends ObservableInput<infer T> ? T : never>;

  public isIconRotated = false;

  public ngOnInit(): void {
    this.dataSource$ = new Observable((observer: Subscriber<string>) => {
      observer.next(this.control.value);
    })
      .pipe(
        mergeMap((token: string) => this.getStatesAsObservable(token))
      );

    if (this.control.value) {
      this.selections$
        .pipe(
          filter((items: D[]) => !!items?.length),
          map((items: D[]) => items.find(item => item[this.targetSelectionFieldName] === this.control.value)),
          take(1)
        ).subscribe(item => {
        if (item) {
          this.control.setValue(item![this.searchField]);

          this.selectValue({
            value: this.control.value,
            item
          } as TypeaheadMatch);
        }
      });
    }
  }

  public getString(value: any): string {
    return value as string;
  }

  private getStatesAsObservable(token: string): Observable<D[]> {
    const query: RegExp = new RegExp(token, 'i');

    if (!token) {
      return this.selections$;
    }

    return this.selections$.pipe(
      map((state: D[]) => state.filter((item: D) => query.test(String(item[this.searchField]).valueOf())))
    );
  }

  public selectValue(event: TypeaheadMatch): void {
    this.isIconRotated = false;

    this.control.setValue(event.value);
    this.selectItem.emit({
      key: this.nameOfControl,
      value: event.item[this.targetSelectionFieldName]
    });
  }

  public toggleIcon(isIconRotated: boolean): void {
    this.isIconRotated = isIconRotated;
  }
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import {
  AnimationParamsModel, PaginationTableActionEnum, PermissionsEnum, QueryModel, StoreModel,
  TableDataFieldTypeEnum,
  TableDataModel,
  TableEventsEnum,
  TableItemActionEnum,
  TableOptionsModel, UserProfileModel
} from '@models';
import { ClipboardService, TableService } from '@core';
import { KeyValue } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, share, throttleTime } from 'rxjs/operators';
import { basePermissionsConfig } from '@configs';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'app-basic-table',
  templateUrl: './basic-table.component.html',
  styleUrls: ['./basic-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openClose', [
      state('open', style({
        top: '0px',
        left: '0px',
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        padding: '4.5rem',
        background: 'rgba(0, 0, 0, .5)'
      })),
      state('closed', style({
          height: '*',
          width: '*',
          top: '{{ top }}px',
          left: '{{ left }}px',
          padding: '0',
          background: 'unset'
        }),
        {params: {top: 'unset', left: 'unset'}}
      ),
      transition('open => closed', [
        style({
          background: 'unset'
        }),
        animate('.3s cubic-bezier(0.390,  0.575, 0.565, 1.000)', style({
          position: 'absolute',
          top: '{{ top }}px',
          left: '{{ left }}px',
          height: '*',
          width: '*',
          padding: '0',
        }))
      ]),
      transition('closed => open', [
        style({
          position: 'absolute',
        }),
        animate('.3s cubic-bezier(0.470,  0.000, 0.745, 0.715)', style({
          top: '0px',
          left: '0px',
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          padding: '4.5rem'
        })),
        animate('.1s', style({
          background: 'rgba(0, 0, 0, .5)'
        }))
      ]),
    ]),
  ],
})
@UntilDestroy()
export class BasicTableComponent<T> implements AfterViewInit, OnChanges {
  @Input() data!: TableDataModel<T>;

  @Input() tableOptions!: TableOptionsModel<T>;

  @Input() set paginationQuery(query: QueryModel<T>) {
    if (query) {
      this.query = {
        ...query
      } as QueryModel<T>;
    }
  }

  @Input() translate = 'tableHeadings';

  @Output() pagination: EventEmitter<QueryModel<T>> = new EventEmitter<QueryModel<T>>();

  @Output() tableAction: EventEmitter<TableEventsEnum> = new EventEmitter<TableEventsEnum>();

  @Output() itemAction: EventEmitter<KeyValue<TableDataFieldTypeEnum, string>> =
    new EventEmitter<KeyValue<TableDataFieldTypeEnum, string>>();

  @Output() public controlAction: EventEmitter<KeyValue<TableItemActionEnum, T>> =
    new EventEmitter<KeyValue<TableItemActionEnum, T>>();

  public dataFields!: Map<keyof T, TableDataFieldTypeEnum>;

  public totalPages!: number;

  public readonly actionEnum: typeof TableEventsEnum = TableEventsEnum;

  public readonly fieldTypeEnum: typeof TableDataFieldTypeEnum = TableDataFieldTypeEnum;

  public readonly paginationActionEnum: typeof PaginationTableActionEnum = PaginationTableActionEnum;

  public isTableModalShown = false;

  private query: QueryModel<T> = new QueryModel<T>();

  public pageSizeControl: FormControl = new FormControl(this.query.pageSize);

  private offsetTop!: number;
  private offsetLeft!: number;

  constructor(
    private elementRef: ElementRef,
    private tableService: TableService<T>,
    private clipboardService: ClipboardService,
    private activatedRoute: ActivatedRoute,
    private store: Store<StoreModel>
  ) {
  }

  @HostBinding('@openClose') get expand(): AnimationParamsModel {
    return this.isTableModalShown ?
      ({
        value: 'open'
      }) :
      ({
        value: 'closed', params: {
          top: this.offsetTop,
          left: this.offsetLeft
        }
      });
  }

  public ngAfterViewInit(): void {
    this.initTablePosition();

    this.pageSizeControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        untilDestroyed(this)
      )
      .subscribe((val: number) => {
        if (val > 0) {
          this.query.pageSize = val;

          this.pagination.emit(this.query);
        }
      });
  }

  public ngOnChanges(): void {
    if (!this.tableOptions.excludedControlFields) {
      this.tableOptions.excludedControlFields = [TableEventsEnum.edit];
    }

    if (this.data?.tableData && this.data?.tableData.totalSize > 0) {
      this.tableOptions.dataFields = this.tableService.getDataFieldMap(this.data?.tableData.items[0], this.tableOptions);

      this.totalPages = this.calculateTotalPages();
    }
  }

  public get isActionDisabled(): Observable<boolean> {
    return this.store.select('userProfile')
      .pipe(
        filter(user => !!user?.id),
        map((user: UserProfileModel) => {
          const path: string = this.activatedRoute.snapshot.url[0].path;

          if (basePermissionsConfig.includes(path)) {
            return false;
          }

          const permissions: PermissionsEnum[] = user.permissions?.filter(
            item => item.toLowerCase().includes(path.replace('-', ''))
          )!;

          return !permissions.some(item => item.toLowerCase().includes('edit'));
        }),
        share()
      );
  }

  public getFieldType(field: keyof T): TableDataFieldTypeEnum {
    return this.tableOptions.dataFields?.get(field)!;
  }

  public getHeadingField(field: keyof T): string {
    return this.translate + '.' + field.toString();
  }

  public emitAction(action: TableEventsEnum): void {
    if (action === TableEventsEnum.expand) {
      this.isTableModalShown = !this.isTableModalShown;
    }

    this.tableAction.emit(action);
  }

  public onCopy(text: string): void {
    this.clipboardService.copy(text);
  }

  public onItemAction(event: KeyValue<TableDataFieldTypeEnum, string>): void {
    this.itemAction.emit(event);
  }

  public isActionExcluded(field: TableEventsEnum): boolean {
    return !!this.tableOptions?.excludedControlFields?.includes(field);
  }

  public paginationAction(action: PaginationTableActionEnum): void {
    switch (action) {
      case PaginationTableActionEnum.next:
        if (this.query.pageNumber !== this.totalPages) {
          this.query.pageNumber += 1;

          this.pagination.emit(this.query);
        }
        break;
      case PaginationTableActionEnum.previous:
        if (this.query.pageNumber !== 1) {
          this.query.pageNumber -= 1;

          this.pagination.emit(this.query);
        }
        break;
      case PaginationTableActionEnum.last:
        this.query.pageNumber = this.totalPages;

        this.pagination.emit(this.query);
        break;
      case PaginationTableActionEnum.first:
        this.query.pageNumber = 1;

        this.pagination.emit(this.query);
        break;
    }
  }

  public tackByItems(item: any): any {
    return item?.id;
  }

  private calculateTotalPages(): number {
    return Math.ceil(this.data.tableData.totalSize / this.query.pageSize);
  }

  private initTablePosition(): void {
    this.offsetTop = this.elementRef.nativeElement.offsetTop;
    this.offsetLeft = this.elementRef.nativeElement.offsetLeft;
  }

  public onControlAction(event: KeyValue<TableItemActionEnum, T>, item: T): void {
    this.controlAction.emit(event);
  }

  public toggleSortByFilter(field: keyof T): void {
    if (this.isSortedDown(field)) {
      const newOrder: string[] = [...this.query.orderBy!] as string[];
      newOrder[this.query.orderBy?.indexOf(field)!] = `-${field}`;

      this.query.orderBy = newOrder;
    } else if (this.isSortedUp(field)) {
      this.query.orderBy = this.query.orderBy?.filter(item => item !== `-${field}`);
    } else if (this.isNotSorted(field)) {
      this.query.orderBy = this.query?.orderBy ? [...this.query?.orderBy, field] : [field];
    }

    this.pagination.emit(this.query);
  }

  public isSortedUp(field: keyof T): boolean {
    return !!this.query.orderBy?.includes(`-${field}`);
  }

  public isSortedDown(field: keyof T): boolean {
    return !!this.query.orderBy?.includes(field);
  }

  public isNotSorted(field: keyof T): boolean {
    return !this.query.orderBy?.includes(field);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { MeterModel, QueryModel, StoreModel, TableStateKeysType, TableStateModel } from '@models';
import { RoutesEnum } from '../../../../routes.enum';
import { tableActions } from '@actions';
import { Observable } from 'rxjs';
import { selectTable } from '@selectors';
import { filter, map, pluck } from 'rxjs/operators';

@Component({
  selector: 'app-meter',
  templateUrl: './meter.component.html',
  styleUrls: ['./meter.component.scss']
})
export class MeterComponent implements OnInit {
  public meter$!: Observable<MeterModel>;

  public readonly routes: typeof RoutesEnum = RoutesEnum;

  private query: QueryModel<MeterModel> = new QueryModel<MeterModel>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<StoreModel>,
  ) {
  }

  public ngOnInit(): void {
    this.query.pageNumber = null!;
    this.query.pageSize = null!;
    this.query.filters = {
      id: +this.activatedRoute.snapshot.paramMap.get(RoutesEnum.manageMeterId)!
    };

    this.store.dispatch(tableActions.initTableData({field: 'devices', query: this.query}));

    this.meter$ = this.store.select(selectTable('devices'))
      .pipe(
        filter((m: TableStateModel[TableStateKeysType]) => !!m?.totalSize),
        pluck('items'),
        map((i) => i[0] as MeterModel)
      );
  }
}

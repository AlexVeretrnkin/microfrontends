import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { BuildingService } from '@core';
import { Observable } from 'rxjs';
import { BuildingTypeModel, HeadcountModel, StoreModel } from '@models';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectTable } from '@selectors';
import { tableActions } from '@actions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent implements OnInit {
  // todo improve

  public isTableModalShown = false;

  public personnel$!: Observable<{ value: number; key: string }[]>;

  public buildings$!: Observable<BuildingTypeModel[]>;

  constructor(
    private buildingService: BuildingService,
    private store: Store<StoreModel>
  ) { }

  public ngOnInit(): void {
    this.store.dispatch(tableActions.initTableData({field: 'buildingTypesCount'}));

    this.buildings$ = this.store.select(selectTable('buildingTypesCount'))
      .pipe(map( b => b?.items)) as Observable<BuildingTypeModel[]>;

    this.personnel$ = this.buildingService.getHeadcount().pipe(
      map(obj => Object.keys(obj).map(k => (
        {
          key: k,
          value: obj[k as keyof HeadcountModel]
        }
      )))
    );
  }

}

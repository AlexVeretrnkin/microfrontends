import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RoutesEnum } from '../../../../routes.enum';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BuildingModel, FloorModel, QueryModel, StoreModel } from '@models';
import { Observable } from 'rxjs';
import { selectTable } from '@selectors';
import { tableActions } from '@actions';
import { map, pluck, tap } from 'rxjs/operators';
import { BuildingService } from '@core';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorComponent implements OnInit {
  public floor$!: Observable<FloorModel>;

  public building$!: Observable<BuildingModel>;

  public readonly routes: typeof RoutesEnum = RoutesEnum;

  private query: QueryModel<FloorModel> = new QueryModel<FloorModel>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<StoreModel>,
    private buildingsService: BuildingService
  ) {
  }

  public ngOnInit(): void {
    this.query.pageNumber = null!;
    this.query.pageSize = null!;
    this.query.filters = {
      id: +this.activatedRoute.snapshot.paramMap.get(this.routes.manageFloorId)!
    };

    this.store.dispatch(tableActions.initTableData({field: 'floors', query: this.query}));

    this.floor$ = this.store.select(selectTable('floors'))
      .pipe(
        pluck('items'),
        map(items => items && items[0] as FloorModel),
        tap(floor => {
          if (floor) {
            this.building$ = this.buildingsService.getBuildings(new QueryModel({
                pageNumber: null!,
                pageSize: null!,
                filters: {
                  id: floor?.buildingId
                }
              } as unknown as QueryModel<BuildingModel>
            )).pipe(pluck('items'), map(r => r && r[0]));
          }
        })
      );
  }
}

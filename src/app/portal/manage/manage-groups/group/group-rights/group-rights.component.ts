import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  GroupModel,
  PaginationModel,
  PermissionsEnum,
  QueryModel,
  StoreModel,
  TableDataModel,
  TableEventsEnum,
  TableOptionsModel,
  TablePermissionModel
} from '@models';
import { selectTable } from '@selectors';
import { filter, map, pluck, switchMap, take, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { excludedFieldConfig } from '@configs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { GroupPermissionsModalComponent } from '../group-permissions-modal/group-permissions-modal.component';
import { GroupsService } from '@core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tableActions } from '@actions';

@Component({
  selector: 'app-group-rights',
  templateUrl: './group-rights.component.html',
  styleUrls: ['./group-rights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class GroupRightsComponent implements OnInit {
  public readonly tableOptions: TableOptionsModel<TablePermissionModel> = {
    excludedFields: [...excludedFieldConfig],
    excludedControlFields: [
      TableEventsEnum.export,
      TableEventsEnum.filter,
      TableEventsEnum.refresh,
      TableEventsEnum.more,
      TableEventsEnum.add
    ]
  };

  public tableData$!: Observable<TableDataModel<TablePermissionModel>>;

  private group!: GroupModel;

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private groupService: GroupsService
  ) {
  }

  public ngOnInit(): void {

    this.tableData$ = this.store.select(selectTable('groups'))
      .pipe(
        pluck('items'),
        map(items => items && items[0] as GroupModel),
        tap(group => this.group = group),
        map(group => (
          {
            heading: 'Список прав доступу',
            tableData: {
              pageSize: group?.permissions?.length,
              totalSize: group?.permissions?.length,
              pageNumber: 1,
              items: group?.permissions?.map(permission => new TablePermissionModel(permission))
            } as PaginationModel<TablePermissionModel>,
          }
        )),
        filter(group => !!group?.tableData)
      );
  }

  public onTableAction(): void {
    const query: QueryModel<GroupModel> = new QueryModel<GroupModel>();
    query.filters = {
      id: this.group.parentGroupId
    };

    this.groupService.read(query)
      .pipe(
        pluck('items'),
        map(items => items && items[0] as GroupModel),
        switchMap(group => this.modalService.show<GroupPermissionsModalComponent>(GroupPermissionsModalComponent, {
            initialState: {
              parentPermissions: group?.permissions?.sort(),
              ownPermissions: this.group.permissions
            }
          }).onHidden as Observable<PermissionsEnum[]>
        ),
        switchMap((permissions: PermissionsEnum[]) => {
          return permissions && Array.isArray(permissions) ? this.groupService.update({
            ...this.group,
            permissions
          }) : of(null);
        }),
        take(1),
        untilDestroyed(this)
      )
      .subscribe(() => {
        query.filters = {
          id: this.group.id
        };

        this.store.dispatch(tableActions.initTableData({field: 'groups', query}));
      });
  }

}

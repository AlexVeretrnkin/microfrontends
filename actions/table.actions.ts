import { createAction, props } from '@ngrx/store';

import { QueryModel, TableStateModel } from '@models';

const initTableData = createAction(
  '[Table] init',
  props<{ field: keyof TableStateModel, query?: QueryModel<any>}>()
);

const setTableData = createAction(
  '[Table] set',
  props<Partial<TableStateModel>>()
);

const deleteTableData = createAction(
  '[Table] delete',
  props<{ field: keyof TableStateModel, item: TableStateModel[keyof TableStateModel]['items'][0], query?: QueryModel<any> }>()
);

const createTableData = createAction(
  '[Table] create',
  props<{ field: keyof TableStateModel, item: TableStateModel[keyof TableStateModel]['items'][0], query?: QueryModel<any> }>()
);

const updateTableData = createAction(
  '[Table] update',
  props<{ field: keyof TableStateModel, item: TableStateModel[keyof TableStateModel]['items'][0], query?: QueryModel<any> }>()
);

export const tableActions = {
  initTableData,
  setTableData,
  deleteTableData,
  createTableData,
  updateTableData
};

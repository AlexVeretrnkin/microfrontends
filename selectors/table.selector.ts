import { StoreModel, TableStateKeysType, TableStateModel } from '@models';
import { createSelector } from '@ngrx/store';

const tableSelector = (state: StoreModel) => state.tables;

export const selectTable = (table: TableStateKeysType) => createSelector(
  tableSelector,
  (state: TableStateModel) => state[table]
);

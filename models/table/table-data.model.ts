import { PaginationModel } from '../pagination.model';

export class TableDataModel<T> {
  public heading!: string;
  public tableData!: PaginationModel<T>;
  public activeFilters?: string[];
}

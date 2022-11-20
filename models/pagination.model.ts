export class PaginationModel<T> {
  public items!: T[];
  public pageNumber!: number;
  public pageSize!: number;
  public totalSize!: number;
}

export class QueryModel<T> {
  public pageNumber: number;
  public pageSize: number;
  public filters?: Partial<T>;
  public orderBy?: Array<keyof T | string>;

  constructor(query?: QueryModel<T>) {
    if (query) {
      this.pageNumber = query?.pageNumber;
      this.pageSize = query?.pageSize;
      this.filters = query?.filters;
      this.orderBy = query?.orderBy;
    } else {
      this.pageNumber = 1;
      this.pageSize = 10;
      this.filters = null!;
      this.orderBy = null!;
    }
  }

  public get httpParams(): { [k: string]: string } {
    const res: { [k: string]: string } = {};

    Object.keys(this).forEach(k => {
      if (k !== 'filters' && !!this[k as keyof this] && k !== 'orderBy') {
        res[k.split(/(?=[A-Z])/).join('_').toLowerCase()] = String(this[k as keyof this]);
      }
    });

    if (this.filters) {
      Object.keys(this.filters).forEach(f => {
        res[f.split(/(?=[A-Z])/).join('_').toLowerCase()] = String(this.filters![f as keyof Partial<T>]);
      });
    }

    if (this.orderBy?.length) {
      res.order_by = this.orderBy.toString().split(/(?=[A-Z])/).join('_').toLowerCase();
    }

    return res;
  }
}

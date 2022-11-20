import { Observable } from 'rxjs';

export interface CrudInterface {
  read: (...args: any) => Observable<any>;
  create: (...args: any) => Observable<any>;
  update: (...args: any) => Observable<any>;
  delete: (...args: any) => Observable<any>;
}

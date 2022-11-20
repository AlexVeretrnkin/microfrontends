import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CamelCaseHelperService } from '../camel-case-helper/camel-case-helper.service';

@Injectable()
export class CamelCaseInterceptorService implements HttpInterceptor {
  constructor(
    private camelCaseHelperService: CamelCaseHelperService
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(
      req.clone({
        body: this.handleBody(req.body)
      })
    )
      .pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            return event.clone({body: this.camelCaseHelperService.nestedObjectToCamelCase(event.body)});
          }

          return event;
        })
      );
  }

  private handleBody(body: any): any {
    if (body instanceof FormData) {
      return body;
    }

    return this.camelCaseHelperService.nestedObjectToSnakeCase(body);
  }
}

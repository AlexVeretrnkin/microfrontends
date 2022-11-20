import { Injectable } from '@angular/core';

@Injectable()
export class CamelCaseHelperService {
  public toCamelCase(s: string): string {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  }

  public toSnakeCase(s: string): string {
    return s.replace(/([A-Z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace($1, `_${$1.toLowerCase()}`).toLowerCase();
    });
  }

  public nestedObjectToSnakeCase(object: any): any {
    if (object) {
      if (Object(object) && !Array.isArray(object) && typeof object !== 'function') {
        const n: any = {};

        Object.keys(object)
          .forEach((k: string) => {
            if (typeof object[k] === 'object') {
              n[this.toSnakeCase(k)] = this.nestedObjectToSnakeCase(object[k]);
            } else {
              n[this.toSnakeCase(k)] = object[k];
            }
          });

        return n;
      } else if (Array.isArray(object) && object.length > 0 && typeof object[0] !== 'string' && typeof object[0] !== 'number') {
        return object.map((i) => {
          return this.nestedObjectToCamelCase(i);
        });
      }

      return object;
    }
  }

  public nestedObjectToCamelCase(object: any): any {
    if (object) {
      if (Object(object) && !Array.isArray(object) && typeof object !== 'function') {
        const n: any = {};

        Object.keys(object)
          .forEach((k: string) => {
            if (typeof object[k] === 'object') {
              n[this.toCamelCase(k)] = this.nestedObjectToCamelCase(object[k]);
            } else {
              n[this.toCamelCase(k)] = object[k];
            }
          });

        return n;
      } else if (Array.isArray(object) && object.length > 0 && typeof object[0] !== 'string' && typeof object[0] !== 'number') {
        return object.map((i) => {
          return this.nestedObjectToCamelCase(i);
        });
      }

      return object;
    }
  }
}

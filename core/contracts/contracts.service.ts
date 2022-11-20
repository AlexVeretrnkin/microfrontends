import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CamelCaseHelperService } from '@base-core';

import { ContractModel, PaginationModel } from '@models';

import { ApiUrls } from '../api-urls';

@Injectable()
export class ContractsService {
  constructor(
    private httpClient: HttpClient,
    private camelCaseHelper: CamelCaseHelperService
  ) { }

  public getContracts(): Observable<PaginationModel<ContractModel>> {
    return this.httpClient.get<PaginationModel<ContractModel>>(ApiUrls.getContractsUrl())
      .pipe(
        map(contracts => ({
          ...contracts,
          items: contracts.items.map(c => new ContractModel(c))
        }))
      );
  }

  public createContract(doc: ContractModel): Observable<ContractModel> {
    const data: FormData = new FormData();

    doc.startDate = new Date(doc.startDate).toISOString();
    doc.expirationDate = new Date(doc.expirationDate).toISOString();

    Object.keys(doc).forEach(k => data.set(this.camelCaseHelper.toSnakeCase(k), doc[k as keyof ContractModel] as File));

    return this.httpClient.post<ContractModel>(ApiUrls.getContractsUrl(), data);
  }

  public editContract(doc: ContractModel): Observable<ContractModel> {
    const data: FormData = new FormData();

    console.log(doc);

    doc.startDate = new Date(doc.startDate).toISOString();
    doc.expirationDate = new Date(doc.expirationDate).toISOString();

    Object.keys(doc).forEach(k => data.set(this.camelCaseHelper.toSnakeCase(k), doc[k as keyof ContractModel] as File));

    return this.httpClient.patch<ContractModel>(ApiUrls.getContractsUrl(doc.id.toString() + '/'), data);
  }

  public removeContract(docId: string): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getContractsUrl(docId + '/'));
  }
}

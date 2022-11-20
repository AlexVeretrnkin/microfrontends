import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import {
  AddDocumentationModel,
  AddDocumentModel,
  CrudInterface,
  DocumentationModel,
  DocumentModel,
  PaginationModel,
  QueryModel
} from '@models';

import { ApiUrls } from '../api-urls';
import { map } from 'rxjs/operators';


@Injectable()
export class DocumentsService implements CrudInterface {
  constructor(
    private httpClient: HttpClient
  ) {
  }

  public getDocuments(): Observable<PaginationModel<DocumentModel>> {
    return this.httpClient.get<PaginationModel<DocumentModel>>(ApiUrls.getDocumentsUrl())
      .pipe(
        map(docs => ({
          ...docs,
          items: docs.items.map(d => new DocumentModel(d))
        }))
      );
  }

  public create(args: any): Observable<any> {
    return of(null);
  }

  public delete(args: any): Observable<any> {
    return of(null);
  }

  public read(query?: QueryModel<DocumentationModel>): Observable<PaginationModel<DocumentationModel>> {
    return this.httpClient.get<PaginationModel<DocumentationModel>>(ApiUrls.getDocumentationUrl(), {
      params: query?.httpParams
    })
      .pipe(
        map(docs => ({
          ...docs,
          items: docs.items.map(d => new DocumentationModel(d))
        }))
      );
  }

  public update(args: any): Observable<any> {
    return of(null);
  }

  public createDocument(doc: AddDocumentModel): Observable<DocumentModel> {
    const data: FormData = new FormData();

    Object.keys(doc).forEach(k => data.set(k, doc[k as keyof AddDocumentModel] as File));

    return this.httpClient.post<DocumentModel>(ApiUrls.getDocumentsUrl(), data);
  }

  public editDocument(doc: DocumentModel): Observable<DocumentModel> {
    const data: FormData = new FormData();

    Object.keys(doc).forEach(k => data.set(k, doc[k as keyof AddDocumentModel] as File));

    return this.httpClient.patch<DocumentModel>(ApiUrls.getDocumentsUrl(doc.id.toString() + '/'), data);
  }

  public removeDocument(docId: string): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getDocumentationUrl(docId + '/'));
  }


  public getDocumentation(): Observable<PaginationModel<DocumentationModel>> {
    return this.httpClient.get<PaginationModel<DocumentationModel>>(ApiUrls.getDocumentationUrl())
      .pipe(
        map(docs => ({
          ...docs,
          items: docs.items.map(d => new DocumentationModel(d))
        }))
      );
  }

  public createDocumentation(doc: AddDocumentationModel): Observable<DocumentationModel> {
    const data: FormData = new FormData();

    Object.keys(doc).forEach(k => data.set(k, doc[k as keyof AddDocumentationModel] as File));

    return this.httpClient.post<DocumentationModel>(ApiUrls.getDocumentationUrl(), data);
  }

  public editDocumentation(doc: DocumentationModel): Observable<DocumentationModel> {
    const data: FormData = new FormData();

    Object.keys(doc).forEach(k => data.set(k, doc[k as keyof DocumentationModel] as File));

    return this.httpClient.patch<DocumentationModel>(ApiUrls.getDocumentationUrl(doc.id.toString() + '/'), data);
  }

  public removeDocumentation(docId: string): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getDocumentationUrl(docId + '/'));
  }
}

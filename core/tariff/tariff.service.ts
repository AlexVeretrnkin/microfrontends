import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddTariffModel, CrudInterface, TariffModel } from '@models';
import { Observable } from 'rxjs';
import { ApiUrls } from '../api-urls';
import { CamelCaseHelperService } from '@base-core';

@Injectable()
export class TariffService implements CrudInterface {
  constructor(
    private httpClient: HttpClient,
    private camelCaseHelper: CamelCaseHelperService
  ) {
  }

  public create(tariff: AddTariffModel): Observable<TariffModel> {
    const formData: FormData = new FormData();

    const newTariff: AddTariffModel = {
      ...tariff,
      enactedSince: new Date(tariff.enactedSince).toISOString()
    };

    Object.keys(newTariff).forEach(k => {
      if (newTariff[k as keyof AddTariffModel]) {
        if (k !== 'file') {
          formData.append(this.camelCaseHelper.toSnakeCase(k), String(newTariff[k as keyof AddTariffModel]));
        } else {
          formData.append(this.camelCaseHelper.toSnakeCase(k), newTariff[k as keyof AddTariffModel] as File);
        }
      }
    });

    return this.httpClient.post<TariffModel>(ApiUrls.getTariffsUrl(), formData);
  }

  public delete(tariff: TariffModel): Observable<null> {
    return this.httpClient.delete<null>(ApiUrls.getTariffsUrl(tariff.id!.toString() + '/'));
  }

  public read(): Observable<TariffModel[]> {
    return this.httpClient.get<TariffModel[]>(ApiUrls.getTariffsUrl());
  }

  public update(tariff: AddTariffModel): Observable<TariffModel> {
    const formData: FormData = new FormData();

    const newTariff: AddTariffModel = {
      ...tariff,
      enactedSince: new Date(tariff.enactedSince).toISOString()
    };

    Object.keys(newTariff).forEach(k => {
      if (newTariff[k as keyof AddTariffModel]) {
        if (k !== 'file') {
          formData.append(this.camelCaseHelper.toSnakeCase(k), String(newTariff[k as keyof AddTariffModel]));
        } else {
          formData.append(this.camelCaseHelper.toSnakeCase(k), newTariff[k as keyof AddTariffModel] as File);
        }
      }
    });

    return this.httpClient.patch<TariffModel>(ApiUrls.getTariffsUrl(tariff.id!.toString() + '/'), formData);
  }
}

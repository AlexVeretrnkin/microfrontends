import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AddDocumentationModel,
  DocumentationModel, EnvironmentalReadingModel,
  InputTypeEnum,
  ModalActionEnum,
  ModalActionModel, PaginationModel, QueryModel,
  StoreModel,
  TableDataFieldTypeEnum,
  TableDataModel,
  TableEventsEnum,
  TableItemActionEnum,
  TableOptionsModel,
  TableStateKeysType,
  TableStateModel,
  YesNoEnum
} from '@models';
import { excludedFieldConfig } from '@configs';
import { Observable, of } from 'rxjs';
import { FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DocumentsService, FileHelperService } from '@core';
import { exhaustMap, map, switchMap, take } from 'rxjs/operators';
import { KeyValue } from '@angular/common';
import { InputModalComponent, MapViewerModalComponent } from '@portal-shared';
import { YesNoModalComponent } from '@shared';
import { selectTable } from '@selectors';
import { tableActions } from '@actions';

@Component({
  selector: 'app-documents',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentationComponent implements OnInit {
  public readonly tableOptions: TableOptionsModel<DocumentationModel> = {
    excludedFields: ['id', 'created', 'fileUrl', 'fileSize', 'fileName', 'type'],
    itemActionsIcons: [
      {
        type: TableItemActionEnum.link,
      },
      {
        type: TableItemActionEnum.edit,
      },
      {
        type: TableItemActionEnum.download,
      }
    ],
    dataFields: new Map([
      ['updated', TableDataFieldTypeEnum.date]
    ])
  };

  public tableData$!: Observable<TableDataModel<DocumentationModel>>;

  public contactInfoFormGroup!: FormArray;

  constructor(
    private store: Store<StoreModel>,
    private modalService: BsModalService,
    private documentsService: DocumentsService,
    private fileHelper: FileHelperService
  ) {
  }

  public ngOnInit(): void {
    this.initTableData();
  }

  public onTableAction(action: TableEventsEnum): void {
    switch (action) {
      case TableEventsEnum.add:
        this.openInputModal(new DocumentationModel())
          .onHidden
          .pipe(
            switchMap((value: ModalActionModel<DocumentationModel>) => {
              if (value.action === ModalActionEnum.create) {
                return this.documentsService.createDocumentation(value.data!);
              }

              return of(null!);
            }),
            take(1)
          )
          .subscribe(
            _ => this.fetchTableData(),
            _ => this.fetchTableData()
          );
        break;
    }
  }

  public onItemAction(event: KeyValue<TableDataFieldTypeEnum, string>): void {
    switch (event.key) {
      case TableDataFieldTypeEnum.coordinates:
        const [latitude, longitude]: string[] = event.value.split(' ');

        this.modalService.show(MapViewerModalComponent, {
          initialState: {
            coordinates: new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude))
          }
        });
        break;
    }
  }

  public onControlAction(event: KeyValue<TableItemActionEnum, DocumentationModel>): void {
    switch (event.key) {
      case TableItemActionEnum.edit:
        this.openInputModal({
          ...event.value,
          file: event.value.fileName as string,
        })
          .onHidden
          .pipe(
            exhaustMap((value: ModalActionModel<DocumentationModel>) => {
              if (value.action === ModalActionEnum.edit) {
                console.log(value.data);

                return this.documentsService.editDocumentation({
                  ...value.data!,
                  id: event.value.id
                });
              }

              if (value.action === ModalActionEnum.delete) {
                return this.deleteItem(event);
              }

              return of(null!);
            }),
            take(1)
          )
          .subscribe(
            _ => this.fetchTableData(),
            _ => this.fetchTableData()
          );
        break;
      case TableItemActionEnum.download:
        this.fileHelper.downloadFileByUrl(event.value.fileUrl, event.value.fileName);
        break;
      case TableItemActionEnum.link:
        window.open(event.value.fileUrl);
        break;
    }
  }

  public onPagination(query: QueryModel<DocumentationModel>): void {
    this.store.dispatch(tableActions.initTableData({field: 'documentation', query: new QueryModel(query)}));
  }

  private deleteItem(event: KeyValue<TableItemActionEnum, DocumentationModel>): Observable<null> {
    return this.modalService.show(YesNoModalComponent, {
      initialState: {
        data: {
          subtitle: 'Дані будут видалені',
          title: 'Ви впевнені?'
        }
      }
    }).onHidden
      .pipe(
        switchMap((value: YesNoEnum) => {
          if (value === YesNoEnum.accept) {
            return this.documentsService.removeDocumentation(event.value.id!.toString());
          }

          return of(null!);
        })
      );
  }

  private initTableData(): void {
    this.tableData$ = this.store.select(selectTable('documentation'))
      .pipe(
        map((data: TableStateModel[TableStateKeysType]) => {
          return {
            heading: 'Список документації',
            tableData: data as PaginationModel<DocumentationModel>,
          };
        })
      );

    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.store.dispatch(tableActions.initTableData({field: 'documentation'}));
  }

  private openInputModal(doc?: AddDocumentationModel): BsModalRef {
    return this.modalService.show<InputModalComponent<AddDocumentationModel>>(
      InputModalComponent,
      {
        initialState: {
          inputData: {
            heading: 'Редагування типу приміщення',
            subheading: 'Уведіть/змініть дані',
            inputModel: new AddDocumentationModel(doc),
            excludedFields: [...excludedFieldConfig, 'type'],
            fieldsOptions: null!,
            fieldTypes: new Map([
                [
                  'name',
                  {
                    isObligatory: true
                  }
                ],
                [
                  'file',
                  {
                    isObligatory: true,
                    type: InputTypeEnum.File,
                    icon: 'file-icon'
                  }
                ],
                [
                  'order',
                  {
                    isObligatory: true
                  }
                ]
              ]
            )
          }
        }
      }
    );
  }
}

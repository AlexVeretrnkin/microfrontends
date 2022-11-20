import { AnimatedCheckboxModel } from '../animated-checkbox.model';

import { TableDataFieldTypeEnum } from './table-data-field-type.enum';
import { TableItemActionModel } from './table-item-action.model';
import { TableEventsEnum } from './table-events.enum';

export class TableOptionsModel<T> implements AnimatedCheckboxModel{
  public expandable?: boolean;
  public fieldsWithIcons?: Map<keyof T, string>;
  public isCheckboxShown?: boolean;
  public photoFields?: [keyof T];
  public itemActionsIcons?: TableItemActionModel[];
  public dataFields?: Map<keyof T, TableDataFieldTypeEnum>;
  public fieldClasses?: Map<keyof T, string>;
  public expandableDataField?: keyof T;
  public timeFields?: Array<keyof T>;
  public excludedFields?: Array<keyof T>;
  public isChecked?: boolean;
  public excludedControlFields?: TableEventsEnum[];
  public disabledControlFields?: TableEventsEnum[];
}

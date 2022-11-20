export class ContactInfoModel {
  public name!: string;
  public type!: string;
  public value!: string;
  public notes!: string;
  public id?: string;

  constructor(contactInfo?: ContactInfoModel) {
    this.name = contactInfo?.name || null!;
    this.type = contactInfo?.type || null!;
    this.value = contactInfo?.value || null!;
    this.notes = contactInfo?.notes || null!;
    this.id = contactInfo?.id ?? null!;
  }
}

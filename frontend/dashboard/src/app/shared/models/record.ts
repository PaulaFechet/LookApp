export class RecordModel{
  id?: number;
  date: Date;
  value: number;
  categoryId: number;
  note?: string;

  public constructor(date: Date, value: number, categoryId: number, note: string) {
    this.date = date;
    this.value = value;
    this.categoryId = categoryId;
    this.note = note;
  }
}

export class RecordModel{
  id: number;
  date: Date;
  note: string;
  value: number;
  categoryId?: number;

  public constructor(date: Date, value: number, categoryId: number, note: string) {
    this.date = date;
    this.value = value;
    this.categoryId = categoryId;
    this.note = note;
  }
}

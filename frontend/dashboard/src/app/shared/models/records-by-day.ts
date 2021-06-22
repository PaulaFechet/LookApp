export class RecordsByDay {

  public categoryId: number;
  public categoryTitle: string;
  public recordsByDay: Map<Date, number>;

  public constructor(categoryId: number, categoryTitle: string) {

    this.categoryId = categoryId;
    this.categoryTitle = categoryTitle;
    this.recordsByDay = new Map<Date, number>();
  }
}

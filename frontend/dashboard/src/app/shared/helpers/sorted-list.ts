export class SortedList<T> {

  public values: T[];
  private comparator: any;

  constructor(list: T[], comparator: (a: T, b: T) => number) {
    this.values = [...list];
    this.comparator = comparator;
    this.values.sort(comparator);
  }

  public static copy<T>(sortedList: SortedList<T>): SortedList<T> {
    let values = [...sortedList.values];
    let comparator = sortedList.comparator;
    return new SortedList<T>(values, comparator);
  }

  public add(value: T): void {
    for (let i = 0; i < this.values.length; i++) {
      let currentValue = this.values[i];
      if (this.comparator(currentValue, value) > 0) {
        this.values.splice(i, 0, value);
        return;
      }
    }
    this.values.push(value);
  }

  public delete(selector: (a: T) => boolean): void {
    this.values = this.values.filter(selector);
  }
}

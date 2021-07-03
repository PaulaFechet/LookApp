import { ChartPointModel } from './../models/chart-point';
import { Injectable } from '@angular/core';
import { RecordsByDay } from '../models/records-by-day';
import { CategoriesToCorrelate } from './../models/categories-to-correlate';
import { RecordModel } from '../models/record';

@Injectable({
  providedIn: 'root'
})
export class CorrelationService {

  // public categoriesToCorrelate: CategoriesToCorrelate[];
  // public categoryId: number;
  // public categoryTitle: string;
  // public parsedRecordGraphs: RecordsByDay[];
  // public chartDataSetToCorrelate: ChartPointModel[];

  // public constructor(categoriesToCorrelate: CategoriesToCorrelate[],
  //   categoryId: number,
  //   categoryTitle: string,
  //   parsedRecordGraphs: RecordsByDay[]) {
  //   this.categoriesToCorrelate = categoriesToCorrelate;
  //   this.categoryId = categoryId;
  //   this.parsedRecordGraphs = parsedRecordGraphs;
  //   this.categoryTitle = categoryTitle;
  //   this.chartDataSetToCorrelate = this.chartDataSetToCorrelate;
  // }
  public correlationCoeff : number = undefined;

  public groupRecordsByDay(chartDataSetToCorrelate: ChartPointModel[], categoryId: number, categoryTitle: string): RecordsByDay {

    let groupedDataSet: RecordsByDay = chartDataSetToCorrelate.reduce(
      (acc: RecordsByDay, record: ChartPointModel) => {

        let day: string = record.x.toString().split("T")[0];
        let val: number = record.y;

        if (acc.recordsByDay[day]) {
          acc.recordsByDay[day] += val;
        } else {
          acc.recordsByDay[day] = val;
        }

        return acc;

      }, new RecordsByDay(categoryId, categoryTitle));

    return groupedDataSet;
  }


  getValuesOnSameDate(firstDataSet: RecordsByDay, secondDataSet: RecordsByDay): CategoriesToCorrelate[] {

    let firstDataSET = JSON.parse(JSON.stringify(firstDataSet));
    let secondDataSET = JSON.parse(JSON.stringify(secondDataSet));

    let categoriesToCorrelate: CategoriesToCorrelate[] = [];

    for (const [key, value] of Object.entries(secondDataSET.recordsByDay)) {
      if (firstDataSET.recordsByDay[key] == undefined) {
        delete secondDataSET.recordsByDay[key];
      }
    }

    for (const [key, value] of Object.entries(firstDataSET.recordsByDay)) {
      if (secondDataSET.recordsByDay[key] == undefined) {
        delete firstDataSET.recordsByDay[key];
      }
    }

    categoriesToCorrelate.push({ "firstCategory": firstDataSET, "secondCategory": secondDataSET });

    return categoriesToCorrelate;
  }

  calculateCorrelationCoef(categoriesToCorrelate: CategoriesToCorrelate[]): number {
    let sumOfX: number = 0;
    let sumOfY: number = 0;

    let x: number = 0;
    let y: number = 0;

    let sumOfXMultipliedWithY: number = 0;

    let sumOfSquareX = 0;
    let sumOfSquareY = 0;

    let n = 0;

    for (const [key, value] of Object.entries(categoriesToCorrelate[0].firstCategory.recordsByDay)) {
      x = value;
      sumOfX += x;

      y = categoriesToCorrelate[0].secondCategory.recordsByDay[key];
      sumOfY += y;

      sumOfXMultipliedWithY += x * y;

      sumOfSquareX += x * x;
      sumOfSquareY += y * y;
    }
    n = Object.getOwnPropertyNames(categoriesToCorrelate[0].firstCategory.recordsByDay).length;

    let numitor: number = Math.sqrt((n * sumOfSquareX - sumOfX * sumOfX) * (n * sumOfSquareY - sumOfY * sumOfY));
    let numarator: number = (n * sumOfXMultipliedWithY - sumOfX * sumOfY);
    this.correlationCoeff = numarator / numitor;

    if(numitor == 0){
      this.correlationCoeff = 0;
    }

    return this.correlationCoeff;
  }

  toChartPoints(records: RecordModel[]): ChartPointModel[] {

    return records.map((record: RecordModel) => {
      return new ChartPointModel(record.date.toString(), record.value);
    });
  }

}

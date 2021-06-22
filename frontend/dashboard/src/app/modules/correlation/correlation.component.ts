import { CategoriesToCorrelate } from './../../shared/models/categories-to-correlate';
import { first } from 'rxjs/operators';
import { CategoryRecords } from './../../shared/models/category-records';
import { RecordsByDay } from './../../shared/models/records-by-day';
import { RecordModel } from './../../shared/models/record';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as Chart from 'chart.js';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CategoryModel } from 'src/app/shared/models/category';
import { CategoryService } from 'src/app/shared/services/category.service';
import { RecordService } from 'src/app/shared/services/record.service';
import { ChartPointModel } from './../../shared/models/chart-point';
import { MultiselectItem } from './multiselect-item';
import { keyframes } from '@angular/animations';

@Component({
  selector: 'app-correlation',
  templateUrl: './correlation.component.html',
  styleUrls: ['./correlation.component.scss']
})
export class CorrelationComponent implements OnInit {
  public chart: Chart;
  public scatterCorrelationChart: Chart;

  @ViewChild('multiSelect') multiSelect;

  public selectedItems: MultiselectItem[];
  public myForm: FormGroup;
  public ShowFilter = false;
  public limitSelection = false;
  public dropdownSettings: IDropdownSettings = {};
  public dropdownList = [];

  public categoryColor: string;

  public categoryList: CategoryModel[] = [];

  public recordGraphs: CategoryRecords[] = [];

  public disabledButton: boolean = true;

  public errorMessage: string = '';
  public correlationCoefficientInfoMessage: string = '';

  public displayScatterCorrelationChart: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private recordService: RecordService) { }

  ngOnInit() {
    this.categoryService.populateCategories().subscribe(categorie$ => {
      categorie$.subscribe(categories => {
        this.categoryList = categories;
        this.categoryList.forEach(element => {
          this.dropdownList = this.dropdownList.concat({ "id": element.id, "text": element.title })
        });
      });
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    let ctx = document.getElementById("canvas");


    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [

        ]
      },
      options: {
        title: {
          display: true,
          text: '',
          fontSize: 18
        },
        legend: {
          display: true,
          position: "bottom"
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'day'
            },

          }]
        }
      }
    });
  }

  onItemSelect(item: any) {
    this.addRecordsToChart(item.id, item.text);
  }


  onSelectAll(items: any) {
    console.log(items);
    for (var i = 0; i < items.length; i++) {
      this.addRecordsToChart(items[i].id, items[i].text);
    }
  }

  onDeSelectAll(items: any) {
    this.chart.data.datasets = [];

    this.chart.update();
  }


  onItemDeSelect(deselectedCategory: any): void {
    console.log(deselectedCategory);
    for (var i = 0; i < this.chart.data.datasets.length; i++) {
      if (this.chart.data.datasets[i].label == deselectedCategory.text) {
        this.chart.data.datasets.splice(i, 1)
        this.chart.update();

      }
    }

    for (var j = 0; j < this.recordGraphs.length; j++) {
      if (this.recordGraphs[j].categoryId == deselectedCategory.id) {
        this.recordGraphs.splice(j, 1);
      }
    }

    this.disabledButton = (this.chart.data.datasets.length == 2) ? false : true;

    if (this.disabledButton == true) {
      this.errorMessage = '';
      this.correlationCoefficientInfoMessage = '';
      this.displayScatterCorrelationChart = false;
      this.scatterCorrelationChart.destroy();
    }
  }

  addRecordsToChart(categoryId: number, categoryTitle: string): void {

    this.recordService.getRecordsByCategoryId(categoryId).subscribe(record$ => {
      record$.subscribe(records => {
        this.recordGraphs.push({ "categoryId": categoryId, "records": records.values });

        this.categoryService.getById(categoryId).subscribe(category => {
          this.categoryColor = category.graphColor;
        });

        var newDataset = {

          backgroundColor: "transparent",
          borderColor: this.categoryColor,
          pointBackgroundColor: this.categoryColor,
          pointBorderColor: this.categoryColor,
          pointHoverBackgroundColor: this.categoryColor,
          pointHoverBorderColor: this.categoryColor,
          data: this.toChartPoints(records.values),
          borderWidth: 3,
          label: categoryTitle,
          lineTension: 0
        };

        this.chart.data.datasets.push(newDataset);
        this.chart.update();

        this.disabledButton = this.chart.data.datasets.length != 2;
      });
    });
  }

  groupRecordsByDay(chartDataSetToCorrelate: ChartPointModel[], categoryId: number, categoryTitle: string): RecordsByDay {

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

  getValuesOnSameDate(parsedRecordGraphs: RecordsByDay[]): CategoriesToCorrelate[] {
    let firstDataSet: RecordsByDay = parsedRecordGraphs[0];
    let secondDataSet: RecordsByDay = parsedRecordGraphs[1];

    let categoriesToCorrelate: CategoriesToCorrelate[] = [];

    for (const [key, value] of Object.entries(secondDataSet.recordsByDay)) {
      if (firstDataSet.recordsByDay[key] == undefined) {
        delete secondDataSet.recordsByDay[key];
      }
    }

    for (const [key, value] of Object.entries(firstDataSet.recordsByDay)) {
      if (secondDataSet.recordsByDay[key] == undefined) {
        delete firstDataSet.recordsByDay[key];
      }
    }

    categoriesToCorrelate.push({ "firstCategory": firstDataSet, "secondCategory": secondDataSet });

    console.log(categoriesToCorrelate);

    return categoriesToCorrelate;
  }

  correlate(): void {

    let parsedRecordGraphs: RecordsByDay[] = [];
    let categoryTitle: string = '';

    for (let records of this.recordGraphs) {

      this.categoryService.getById(records.categoryId).subscribe(category => {
        categoryTitle = category.title;
      });

      let chartPoints = this.toChartPoints(records.records);
      let recordsByDay = this.groupRecordsByDay(chartPoints, records.categoryId, categoryTitle);
      parsedRecordGraphs.push(recordsByDay);
    }

    console.log(parsedRecordGraphs);
    let categoriesToCorrelate: CategoriesToCorrelate[] = this.getValuesOnSameDate(parsedRecordGraphs);
    console.log(categoriesToCorrelate);
    let correlationCoeff = this.calculateCorrelation(categoriesToCorrelate);
    console.log(correlationCoeff);
    this.drawScatterCorrelationChart(categoriesToCorrelate);
  }

  calculateCorrelation(categoriesToCorrelate: CategoriesToCorrelate[]): number {
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
      console.log("x", x);
      sumOfX += x;

      y = categoriesToCorrelate[0].secondCategory.recordsByDay[key];
      console.log("y", y);
      sumOfY += y;

      sumOfXMultipliedWithY += x * y;

      sumOfSquareX += x * x;
      sumOfSquareY += y * y;


    }
    n = Object.getOwnPropertyNames(categoriesToCorrelate[0].firstCategory.recordsByDay).length;

    if (n < 3) {
      this.errorMessage = 'Error: You may enter at least 5 related category values';
      return -1;
    }

    this.errorMessage = '';

    let numitor: number = Math.sqrt((n * sumOfSquareX - sumOfX * sumOfX) * (n * sumOfSquareY - sumOfY * sumOfY));
    let numarator: number = (n * sumOfXMultipliedWithY - sumOfX * sumOfY);
    let correlationCoeff: number = numarator / numitor;

    this.correlationCoefficientInfoMessage = 'Correlation Coefficient: ' + correlationCoeff;

    return correlationCoeff;
  }

  toChartPoints(records: RecordModel[]): ChartPointModel[] {

    return records.map((record: RecordModel) => {
      return new ChartPointModel(record.date.toString(), record.value);
    });
  }


  drawScatterCorrelationChart(categoriesToCorrelate: CategoriesToCorrelate[]): void {
    this.displayScatterCorrelationChart = true;
    let context = document.getElementById("scatterCorrelationChart");
    console.log(categoriesToCorrelate);

    let x: string = '';
    let y: number = 0;

    let chartDataset: ChartPointModel[] = [];

    for (const [key, value] of Object.entries(categoriesToCorrelate[0].firstCategory.recordsByDay)) {
      x = categoriesToCorrelate[0].firstCategory.recordsByDay[key];
      y = categoriesToCorrelate[0].secondCategory.recordsByDay[key];
      chartDataset.push({ "x": x, "y": y });
    }

    console.log(chartDataset);
    this.scatterCorrelationChart = new Chart(context, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Scatter Dataset',
          data: chartDataset,
          pointRadius: 5,
          backgroundColor: 'rgb(255, 99, 132)'
        }],
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: categoriesToCorrelate[0].firstCategory.categoryTitle,
              fontFamily: 'sans-serif',
              fontStyle: 'blond'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: categoriesToCorrelate[0].secondCategory.categoryTitle,
              fontFamily: 'sans-serif',
              fontStyle: 'blond'
            },
          }],
          responsive: true,
        },
      }
    });
  }
}

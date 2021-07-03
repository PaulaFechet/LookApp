import { CorrelationService } from './../../shared/services/correlation.service';
import { CategoriesToCorrelate } from './../../shared/models/categories-to-correlate';
import { CategoryRecords } from './../../shared/models/category-records';
import { RecordsByDay } from './../../shared/models/records-by-day';
import { RecordModel } from './../../shared/models/record';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as Chart from 'chart.js';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CategoryModel } from 'src/app/shared/models/category';
import { CategoryService } from 'src/app/shared/services/category.service';
import { RecordService } from 'src/app/shared/services/record.service';
import { ChartPointModel } from './../../shared/models/chart-point';
import { MultiselectItem } from './multiselect-item';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';


@Component({
  selector: 'app-correlation',
  templateUrl: './correlation.component.html',
  styleUrls: ['./correlation.component.scss']
})
export class CorrelationComponent implements OnInit, AfterViewInit, OnDestroy {

  private readonly componentDestroyed$: Subject<boolean> = new Subject();

  @ViewChild('multiSelect') multiSelect;

  public chart: Chart;
  public scatterCorrelationChart: Chart;
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
  public element: any;
  public correlationCoeff :number = undefined;

  constructor(
    private categoryService: CategoryService,
    private recordService: RecordService,
    private correlationService: CorrelationService
  ) {}

  ngOnInit(): void {

    this.categoryService.populateCategories()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(categorie$ => {

        categorie$
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe(categories => {

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
        datasets: []
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
            }
          }]
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.element = document.getElementById("scatterCorrelationChart");
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  public scrollToBottom(): void {
    this.element.scrollIntoView(false); // Bottom
  }

  onItemSelect(item: any) {

    this.addRecordsToChart(item.id, item.text);
    if (this.disabledButton == true) {
      this.errorMessage = '';
      this.correlationCoefficientInfoMessage = '';
      this.displayScatterCorrelationChart = false;
      this.scatterCorrelationChart.destroy();
    }
  }

  onSelectAll(items: any) {
    for (var i = 0; i < items.length; i++) {
      this.addRecordsToChart(items[i].id, items[i].text);
    }
  }

  onDeSelectAll(items: any) {
    this.chart.data.datasets = [];
    this.chart.update();
  }

  onItemDeSelect(deselectedCategory: any): void {

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

    this.recordService.getRecordsByCategoryId(categoryId)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(record$ => {

        record$
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe(records => {

            this.recordGraphs.push({ "categoryId": categoryId, "records": records.values });

            this.categoryService.getById(categoryId)
              .pipe(takeUntil(this.componentDestroyed$))
              .subscribe(category => {

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

  correlate(): void {

    let parsedRecordGraphs: RecordsByDay[] = [];
    let categoryTitle: string = '';

    for (let records of this.recordGraphs) {

      this.categoryService.getById(records.categoryId)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe(category => {

          categoryTitle = category.title;
        });

      let chartPoints = this.toChartPoints(records.records);

      let recordsByDay = this.correlationService.groupRecordsByDay(chartPoints, records.categoryId, categoryTitle);
      parsedRecordGraphs.push(recordsByDay);
    }

    let categoriesToCorrelate: CategoriesToCorrelate[] =
    this.correlationService.getValuesOnSameDate(parsedRecordGraphs[0], parsedRecordGraphs[1]);

    this.correlationCoeff = this.correlationService.calculateCorrelationCoef(categoriesToCorrelate);
    this.drawScatterCorrelationChart(categoriesToCorrelate);
    this.scrollToBottom();
  }

  calculateCorrelation2(categoriesToCorrelate: CategoriesToCorrelate[]): number {

    let mediaX: number = 0;
    let mediaY: number = 0;

    let x: number = 0;
    let y: number = 0;

    let sumOfX: number = 0;
    let sumOfY: number = 0;

    let diff1: number = 0;
    let diff2: number = 0;

    let sx: number = 0;
    let sy: number = 0;

    let sxy: number = 0;

    let n = Object.getOwnPropertyNames(categoriesToCorrelate[0].firstCategory.recordsByDay).length;

    for (const [key, value] of Object.entries(categoriesToCorrelate[0].firstCategory.recordsByDay)) {
      x = value;
      sumOfX += x;

      y = categoriesToCorrelate[0].secondCategory.recordsByDay[key];
      sumOfY += y;
    }

    mediaX = sumOfX / n;
    mediaY = sumOfY / n;

    for (const [key, value] of Object.entries(categoriesToCorrelate[0].firstCategory.recordsByDay)) {
      x = value;
      y = categoriesToCorrelate[0].secondCategory.recordsByDay[key];

      diff1 = x - mediaX;
      diff2 = y - mediaY;

      sxy += diff1 * diff2;
      sx += (x - mediaX) * (x - mediaX);
      sy += (y - mediaY) * (y - mediaY);

    }

    sxy = sxy;
    sx = sx;
    sy = sy;

    let correlationCoeff = sxy / Math.sqrt(sx * sy);
    this.correlationCoefficientInfoMessage = 'Correlation Coefficient: ' + correlationCoeff;

    return sxy / sx * sy;
  }

  toChartPoints(records: RecordModel[]): ChartPointModel[] {

    return records.map((record: RecordModel) => {
      return new ChartPointModel(record.date.toString(), record.value);
    });
  }

  drawScatterCorrelationChart(categoriesToCorrelate: CategoriesToCorrelate[]): void {
    this.displayScatterCorrelationChart = true;
    let context = document.getElementById("scatterCorrelationChart");

    let x: string = '';
    let y: number = 0;

    let chartDataset: ChartPointModel[] = [];

    for (const [key, value] of Object.entries(categoriesToCorrelate[0].firstCategory.recordsByDay)) {
      x = categoriesToCorrelate[0].firstCategory.recordsByDay[key];
      y = categoriesToCorrelate[0].secondCategory.recordsByDay[key];
      chartDataset.push({ "x": x, "y": y });
    }

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

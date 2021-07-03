import { CategoryService } from './../../shared/services/category.service';
import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CategoryModel } from 'src/app/shared/models/category';
import { RecordModel } from 'src/app/shared/models/record';
import { RecordService } from 'src/app/shared/services/record.service';
import { Chart } from 'chart.js';
import { Plugins } from 'src/app/shared/plugins';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-category-graph-preview',
  templateUrl: './category-graph-preview.component.html',
  styleUrls: ['./category-graph-preview.component.scss']
})
export class CategoryGraphPreviewComponent implements AfterViewInit, OnDestroy {

  private readonly componentDestroyed$: Subject<boolean> = new Subject();
  private chart: Chart;

  @Input() categoryId: number;

  @ViewChild('backgroundGrid') backgroundGrid: ElementRef;
  @ViewChild('chartCanvas') canvas: ElementRef;

  public category: CategoryModel = new CategoryModel();
  public recordList: RecordModel[] = [];

  constructor(public categoryService: CategoryService, public recordService: RecordService) { }

  ngAfterViewInit(): void {

    this.categoryService.getById(this.categoryId)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(category => {

        this.category = category;

        this.recordService.getRecordsByCategoryId(this.categoryId)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe(record$ => {

            record$
              .pipe(takeUntil(this.componentDestroyed$))
              .subscribe(records => {

                this.recordList = records.values;
                this.updateChart();
              });
          });
      });

    this.createBackgroundGrid();
  };

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  private createBackgroundGrid(): void {

    let ctx = this.backgroundGrid.nativeElement;

    this.backgroundGrid = new Chart(ctx, {
      type: 'line',
      options: {
        layout: {
          padding: 5
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            ticks: {
              display: false
            },
            gridLines: {
              tickMarkLength: 0
            }
          }],
          yAxes: [{
            ticks: {
              display: false
            },
            gridLines: {
              tickMarkLength: 0
            }
          }],
          responsive: true,
        }
      }
    });
  }

  private updateChart(): void {

    let dateChartList: Date[] = this.recordList.map(r => r.date);
    let valueChartList: number[] = this.recordList.map(r => r.value);

    if (!this.chart) {
      this.createChart(dateChartList, valueChartList);
    } else {
      this.chart.data.labels = dateChartList;
      this.chart.data.datasets[0].data = valueChartList;
      this.chart.update();
    }
  }

  private createChart(dateChartList: Date[], valueChartList: number[]): void {

    let ctx = this.canvas.nativeElement;

    let datasets = [{
      label: this.category.title,
      fill: false,
      lineTension: 0,
      data: valueChartList,
      borderWidth: 3,
      borderColor: this.category.graphColor,
      pointBackgroundColor: this.category.graphColor,
      pointBorderColor: this.category.graphColor,
      pointHoverBackgroundColor: this.category.graphColor,
      pointHoverBorderColor: this.category.graphColor,
    }];

    this.chart = new Chart(ctx, {
      type: 'line',
      options: {
        layout: {
          padding: 5
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            ticks: {
              display: false
            },
            gridLines: {
              display: false,
              tickMarkLength: 0
            }
          }],
          yAxes: [{
            ticks: {
              display: false
            },
            gridLines: {
              display: false,
              tickMarkLength: 0
            }
          }],
          responsive: true,
        },
        plugins: {
          chartAreaBorder: {
            borderColor: this.category.graphColor,
            borderWidth: 2,
            borderDash: [5, 5],
            borderDashOffset: 2
          }
        }
      },
      data: {
        labels: dateChartList,
        datasets: datasets
      },
      plugins: [Plugins.chartAreaBorderPlugin()]
    });
  }
}

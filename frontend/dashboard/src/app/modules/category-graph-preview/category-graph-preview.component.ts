import { CategoryService } from './../../shared/services/category.service';
import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CategoryModel } from 'src/app/shared/models/category';
import { RecordModel } from 'src/app/shared/models/record';
import { RecordService } from 'src/app/shared/services/record.service';
import { Chart } from 'chart.js';
import { Plugins } from 'src/app/shared/plugins';

@Component({
  selector: 'app-category-graph-preview',
  templateUrl: './category-graph-preview.component.html',
  styleUrls: ['./category-graph-preview.component.scss']
})
export class CategoryGraphPreviewComponent implements AfterViewInit {
  @Input() categoryId: number;

  @ViewChild('chartCanvas') canvas: ElementRef;

  public category: CategoryModel = new CategoryModel();
  public recordList: RecordModel[] = [];

  private chart: Chart;


  constructor(public categoryService: CategoryService,
    public recordService: RecordService) { }

  ngAfterViewInit(): void {

    this.categoryService.getById(this.categoryId).subscribe(category => {
      this.category = category;

      this.recordService.getRecordsByCategoryId(this.categoryId).subscribe(record$ => {
        record$.subscribe(records => {

          this.recordList = records.values;
          this.updateChart();
        });
      });
    });
  };

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
            gridLines: { tickMarkLength: 0 }
          }],
          yAxes: [{
            ticks: {
              display: false
            },
            gridLines: { tickMarkLength: 0 }
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

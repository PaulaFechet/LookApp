import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as Chart from 'chart.js';
import { CategoryModel } from 'src/app/shared/models/category';
import { RecordModel } from 'src/app/shared/models/record';
import { CategoryService } from 'src/app/shared/services/category.service';
import { RecordService } from 'src/app/shared/services/record.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent implements OnInit {

  public readonly displayedColumns: string[] = ['Date', 'Note', 'Value', 'Action'];
  public category: CategoryModel = new CategoryModel();
  public recordList: RecordModel[] = [];

  private readonly chartCanvasId: string = "recordChart";
  private categoryId: number;
  private chart: Chart;

  constructor(
    private readonly router: ActivatedRoute,
    private readonly categoryService: CategoryService,
    private readonly recordService: RecordService,
    private readonly modal: MatDialog
  ) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(paramMap => {
      this.categoryId = +paramMap.get('id');

      this.categoryService.getById(this.categoryId).subscribe(category => {
        this.category = category;

        this.recordService.getRecordsByCategoryId(this.categoryId).subscribe(record$ => {
          record$.subscribe(records => {

            this.recordList = records.values;
            this.updateChart();
          });
        });
      });
    })
  }

  openModal(action: string, obj: any): void {
    obj.action = action;
    const modalRef = this.modal.open(DialogBoxComponent, {
      width: '250px',
      data: obj
    });

    modalRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        console.log("add");
      } else if (result.event == 'Update') {
        console.log("update");
      } else if (result.event == 'Delete') {
        this.recordService.deleteRecord(this.categoryId, result.data.id).subscribe(() => {
          this.updateChart();
        });
      }
    });
  }

  onChartClickWrapper(): (event: MouseEvent) => void {
    return (event: MouseEvent): void => {
      let x = this.chart.scales["x-axis-0"].getValueForPixel(event.offsetX);
      let y = this.chart.scales["y-axis-0"].getValueForPixel(event.offsetY);

      let newRecord = new RecordModel(x, y, this.categoryId, null);
      this.recordService.addRecord(newRecord).subscribe();
    };
  }

  private createChart(dateChartList: Date[], valueChartList: number[]): void {

    let ctx = document.getElementById(this.chartCanvasId);

    this.chart = new Chart(ctx, {
      type: 'line',
      options: {
        onClick: this.onChartClickWrapper(),
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'day'
            },
            scaleLabel: {
              display: true,
              labelString: 'Date'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.category.unitOfMeasure
            },
            ticks: {
              suggestedMax: this.category.upperLimit,
              suggestedMin: this.category.lowerLimit
            }
          }],
          responsive: true,
        }
      },
      data: {
        labels: dateChartList,
        datasets: [{
          label: this.category.title,
          lineTension: 0,
          data: valueChartList,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
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
}

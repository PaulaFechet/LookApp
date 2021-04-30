import { CategoryService } from 'src/app/shared/services/category.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import * as Chart from 'chart.js';
import { CategoryModel } from 'src/app/shared/models/category';
import { CategoryRepositoryService } from 'src/app/shared/repositories/category-repository.service';
import { RecordService } from 'src/app/shared/services/record.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { MatDialog } from '@angular/material/dialog';
import { ThrowStmt } from '@angular/compiler';
import { RecordModel } from 'src/app/shared/models/record';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent implements OnInit {

  private categoryId: number;
  public category: CategoryModel;
  public dateChartList = [];
  public valueChartList = [];
  public displayedColumns: string[] = ['Date', 'Note', 'Value', 'Action'];
  public dataSource;
  public recordList = [];
  public categoryTitle = '';
  public categoryType = '';

  constructor(
    private router: ActivatedRoute,
    private categoryService: CategoryService,
    private recordService: RecordService,
    public dialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log("ngOnInit");
    this.router.paramMap.subscribe(paramMap => {
      this.categoryId = +paramMap.get('id');

      this.categoryService.getById(this.categoryId).subscribe(category => {
        this.category = category;
        this.categoryTitle = category.title;
        this.categoryType = category.type;

        this.recordService.getRecordsByCategoryId(this.categoryId).subscribe(records$ => {
          records$.subscribe(records => {
            this.recordList = records;
            this.createChart(this.categoryTitle, this.categoryType, this.recordList);
          });
        });
      });
    })
  }

  plotChart(): void {

  }

  sortVectorByDate(records) {
    records.sort(function (a, b) {
      // convert date object into number to resolve issue in typescript
      return +new Date(a.date) - +new Date(b.date);
    })
  }

  createChart(categoryTitle: string, categoryType: string, recordList: RecordModel[]): Chart {
    console.log("chart");

    this.recordList = recordList;
    this.sortVectorByDate(this.recordList);

    this.dateChartList = [];
    this.valueChartList = [];

    this.recordList.forEach(r => {
      this.dateChartList.push(r["date"]);
      this.valueChartList.push(r["value"]);
    })
    var ctx = document.getElementById("recordChart");

    var myChart = new Chart(ctx, {
      type: 'line',
      options: {
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
              labelString: categoryType
            }
          }],
          responsive: true,
        }
      },
      data: {
        labels: this.dateChartList,
        datasets: [{
          label: categoryTitle,
          lineTension: 0,
          data: this.valueChartList,
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

    //this.changeDetectorRef.detectChanges();
  }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.event == 'Add') {
        console.log("add");
      } else if (result.event == 'Update') {
        console.log("update");
      } else if (result.event == 'Delete') {
        this.recordService.deleteRecord(this.categoryId, result.data.id).subscribe(() => {
          this.createChart(this.categoryTitle, this.categoryType, this.recordList);
        });
      }
    });
  }
}

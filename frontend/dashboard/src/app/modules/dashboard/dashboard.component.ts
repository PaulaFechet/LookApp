import { CorrelatedCategories } from './../../shared/models/correlated-categories';
import { RecordsByDay } from './../../shared/models/records-by-day';
import { CorrelationService } from './../../shared/services/correlation.service';
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

import { CategoryModel } from "src/app/shared/models/category";
import { CategoryRecords } from "src/app/shared/models/category-records";
import { CategoryService } from "src/app/shared/services/category.service";
import { RecordService } from 'src/app/shared/services/record.service';
import { CategoriesToCorrelate } from 'src/app/shared/models/categories-to-correlate';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  public chartOptions: any;
  public spark1: any;
  public spark2: any;
  public spark3: any;
  public dataSource;
  public categoryList: CategoryModel[] = [];
  public recordGraphs: CategoryRecords[] = [];
  public correlationCoeff: number = 0;
  public parsedRecordGraphs: RecordsByDay[] = [];
  public categoriesToCorrelate: CategoriesToCorrelate[][] = [];
  public categoryToCorrelate: any = [];
  public correlatedCategories: CorrelatedCategories[] = [];
  public readonly displayedColumns: string[] = ['category1', 'category2', 'coefficient'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private categoryService: CategoryService,
    private correlationService: CorrelationService,
    private recordService: RecordService) {
    this.dataSource = new MatTableDataSource<CorrelatedCategories>();
  }

  ngOnInit(): void {

    this.categoryService.populateCategories().subscribe(categorie$ => {
      categorie$.subscribe(categories => {
        this.categoryList = categories;

        let expectedRecordLists = this.categoryList.length;

        for (var i = 0; i < this.categoryList.length; i++) {
          let index = i;
          this.recordService.getRecordsByCategoryId(this.categoryList[index].id).subscribe(record$ => {
            record$.subscribe(records => {
              this.recordGraphs.push({ "categoryId": this.categoryList[index].id, "records": records.values });

              expectedRecordLists--;
              if (expectedRecordLists === 0) {
                this.correlate();
              }
            });
          });
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  correlate(): void {

    let categoryTitle: string = '';

    for (let records of this.recordGraphs) {

      this.categoryService.getById(records.categoryId).subscribe(category => {
        categoryTitle = category.title;

        let chartPoints = this.correlationService.toChartPoints(records.records);
        let recordsByDay = this.correlationService.groupRecordsByDay(chartPoints, records.categoryId, categoryTitle);
        this.parsedRecordGraphs.push(recordsByDay);
      });
    }

    for (var i = 0; i < this.parsedRecordGraphs.length; i++) {
      for (var j = i + 1; j < this.parsedRecordGraphs.length; j++) {
        this.categoryToCorrelate = this.correlationService.getValuesOnSameDate(this.parsedRecordGraphs[i], this.parsedRecordGraphs[j]);
        this.categoriesToCorrelate.push(this.categoryToCorrelate);
      }
    }

    for (var i = 0; i < this.categoriesToCorrelate.length; i++) {
      this.correlationCoeff = this.correlationService.calculateCorrelationCoef(this.categoriesToCorrelate[i]);
      this.correlatedCategories.push({
        "category1": this.categoriesToCorrelate[i][0].firstCategory.categoryTitle,
        "category2": this.categoriesToCorrelate[i][0].secondCategory.categoryTitle,
        "coefficient": this.correlationCoeff
      })
    }
    this.sortCorrelatedCategories(this.correlatedCategories);
    console.log("sorted",this.sortCorrelatedCategories(this.correlatedCategories));

    this.dataSource.data = this.sortCorrelatedCategories(this.correlatedCategories);
  }

  sortCorrelatedCategories(CorrelatedCategories: CorrelatedCategories[]) : CorrelatedCategories[] {
    var sortedArray: CorrelatedCategories[] = CorrelatedCategories.sort((obj1, obj2) => {
      if (obj1.coefficient < obj2.coefficient) {
        return 1;
      }

      if (obj1.coefficient > obj2.coefficient) {
        return -1;
      }

      return 0;
    });
    return sortedArray;
  }
}

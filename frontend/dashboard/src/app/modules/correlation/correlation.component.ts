import { ChartPointModel } from './../../shared/models/chart-point';
import { MultiselectItem } from './multiselect-item';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as Chart from 'chart.js';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CategoryModel } from 'src/app/shared/models/category';
import { RecordModel } from 'src/app/shared/models/record';
import { CategoryService } from 'src/app/shared/services/category.service';
import { RecordService } from 'src/app/shared/services/record.service';

@Component({
  selector: 'app-correlation',
  templateUrl: './correlation.component.html',
  styleUrls: ['./correlation.component.scss']
})
export class CorrelationComponent implements OnInit {
  public chart: Chart;

  @ViewChild('multiSelect') multiSelect;

  public selectedItems: MultiselectItem[];
  myForm: FormGroup;
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  dropdownSettings: IDropdownSettings = {};

  dropdownList = [];

  public categoryList: CategoryModel[] = [];

  public recordGraphs: RecordModel[][] = [];

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
  }

  addRecordsToChart(categoryId: number, categoryTitle: string): void {

    this.recordService.getRecordsByCategoryId(categoryId).subscribe(record$ => {
      record$.subscribe(records => {
        this.recordGraphs.push(records.values);

        let chartData: ChartPointModel[] = [];

        for (const recordVal of records.values) {
          chartData.push({
            x: recordVal.date,
            y: recordVal.value
          });
        }

        var color = ["#ff6384", "#5959e6", "#2babab", "#8c4d15", "#8bc34a", "#607d8b", "#009688"];

        var randomNumber = Math.floor(Math.random() * 6) + 1;

        var newDataset = {

          backgroundColor: "transparent",
          borderColor: color[randomNumber],
          pointBackgroundColor: color[randomNumber],
          pointBorderColor: color[randomNumber],
          pointHoverBackgroundColor: color[randomNumber],
          pointHoverBorderColor: color[randomNumber],
          data: chartData,
          borderWidth: 3,
          label: categoryTitle,
          lineTension: 0
        };

        this.chart.data.datasets.push(newDataset);
        this.chart.update();
      });
    });
  }


}

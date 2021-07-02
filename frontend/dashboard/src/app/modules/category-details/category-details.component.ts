import { AddRecordCommand, ImportRecordCommand } from './../../shared/command-pattern/command';
import { CommandService } from '../../shared/services/command.service';
import { ChartPointModel } from './../../shared/models/chart-point';
import { UpdateRecordComponent } from './../update-record/update-record.component';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { CategoryModel } from 'src/app/shared/models/category';
import { RecordModel } from 'src/app/shared/models/record';
import { CategoryService } from 'src/app/shared/services/category.service';
import { RecordService } from 'src/app/shared/services/record.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { saveAs } from 'file-saver';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';


@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent implements OnInit, AfterViewInit {

  public category: CategoryModel = new CategoryModel();
  public recordList: RecordModel[] = [];
  public zoomStatus;
  public panStatus;
  public zoomOptions;
  public dataSource;

  private readonly chartCanvasId: string = "recordChart";
  private categoryId: number;
  private chart: Chart;

  public selectedValue: string;

  public chartPoints: ChartPointModel[] = [];

  public csvRecords: any[] = [];
  public header = true;

  public dateListFromCsvImport = [];
  public valueListFromCsvImport = [];

  public isAddBtnOn: boolean = false;
  public newRecordModelList: RecordModel[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public readonly displayedColumns: string[] = ['value', 'date', 'note', 'action'];

  @ViewChild('fileImportInput', { static: false }) fileImportInput: any;

  public isUndoBtnDisplayed: boolean = false;

  constructor(
    private readonly router: ActivatedRoute,
    private readonly categoryService: CategoryService,
    private readonly recordService: RecordService,
    private readonly commandService: CommandService,
    private readonly modal: MatDialog,
    private ngxCsvParser: NgxCsvParser
  ) {

    this.dataSource = new MatTableDataSource<RecordModel>();
  }

  ngOnInit(): void {

    this.router.paramMap.subscribe(paramMap => {
      this.categoryId = +paramMap.get('id');

      this.categoryService.getById(this.categoryId).subscribe(category => {
        this.category = category;

        this.recordService.getRecordsByCategoryId(this.categoryId).subscribe(record$ => {
          record$.subscribe(records => {

            this.recordList = records.values;
            this.dataSource.data = this.recordList;
            this.updateChart();
          });
        });
      });
    })

    this.commandService.commandCount$.subscribe(commandCount => {
      if (commandCount > 0) {
        this.isUndoBtnDisplayed = true;
      } else {
        this.isUndoBtnDisplayed = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openModal(action: string, obj: any): void {
    obj.action = action;
    const modalRef = this.modal.open(DialogBoxComponent, {
      width: '250px',
      data: obj
    });

    modalRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        this.recordService.deleteRecord(this.categoryId, result.data.id).subscribe();
      }
    });
  }

  getSelectedChartType(data): void {
    console.log(data);
  }

  print() {
    console.log(this.selectedValue);
  }

  onChartClickWrapper(): (event: MouseEvent) => void {
    return (event: MouseEvent): void => {
      if (this.isAddBtnOn == false) {
        return;
      }
      let x = this.chart.scales["x-axis-0"].getValueForPixel(event.offsetX);
      let y = this.chart.scales["y-axis-0"].getValueForPixel(event.offsetY);

      let newRecord = new RecordModel(x, y, this.categoryId, null);
      let addRecordCommand = new AddRecordCommand(this.recordService, newRecord);
      this.commandService.do(addRecordCommand);
    };
  }

  private createChart(dateChartList: Date[], valueChartList: number[]): void {

    this.zoomOptions = {
      zoom: {
        enabled: true,
        mode: 'xy',
      },
      pan: {
        enabled: true,
        mode: 'xy',
      }
    };

    this.panStatus = () => this.zoomOptions.pan.enabled ? 'enabled' : 'disabled';
    this.zoomStatus = () => this.zoomOptions.zoom.enabled ? 'enabled' : 'disabled';

    let ctx = document.getElementById(this.chartCanvasId);

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
        onClick: this.onChartClickWrapper(),
        layout: {
          padding: 20
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'day'
            },
            gridLines: {
              display: true,
              // drawOnChartArea: true,
              drawBorder: true,
            },
            scaleLabel: {
              display: true,
              labelString: 'Date',
              fontFamily: 'sans-serif',
              fontStyle: 'blond'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.category.unitOfMeasure,
              fontFamily: 'sans-serif',
              fontStyle: 'blond'
            },
            ticks: {
              suggestedMax: this.category.upperLimit,
              suggestedMin: this.category.lowerLimit,
            }
          }],
          responsive: true,
        },

        plugins: {
          zoom: this.zoomOptions,
          title: {
            display: true,
            position: 'bottom',
            text: this.zoomStatus
          }
        },
      }
      ,
      data: {
        labels: dateChartList,
        datasets: datasets
      }
    });

    for (var i = 0; i < dateChartList.length; i++) {
      this.chartPoints.push({ "x": dateChartList[i].toString(), "y": valueChartList[i] })
    }
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

  toggleAddingRecords(): void {
    this.isAddBtnOn = !this.isAddBtnOn;
  }

  downloadAsPng(): void {
    let currentDate = new Date();

    let link = document.createElement('a');
    link.href = this.chart.toBase64Image();
    link.download = `${this.category.title}-${currentDate}.png`;
    link.click();
  }

  downloadAsCsv(): void {
    let data = this.chartPoints;
    console.log(data);
    const replacer = (key, value) => value === null ? '' : value;
    let header = Object.keys(data[0]);
    console.log("header", header);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], { type: 'text/csv' })
    saveAs(blob, `${this.category.title}` + ".csv");
  }

  handleFileInput(e) {
    let file = (e.target as HTMLInputElement).files[0];

    const regex = new RegExp("(.*?)\.(csv)$");
    if (regex.test(file.name)) {
      const files = e.srcElement.files;

      this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
        .pipe().subscribe((result: Array<any>) => {

          console.log('Result', result);

          this.csvRecords = result;
          for (var i = 0; i < this.csvRecords.length; i++) {
            this.dateListFromCsvImport.push(this.csvRecords[i].x);
            this.valueListFromCsvImport.push(this.csvRecords[i].y);
            let newRecord = new RecordModel(this.csvRecords[i].x, this.csvRecords[i].y, this.categoryId, null);
            this.newRecordModelList.push(newRecord);
          }

          console.log(this.newRecordModelList);
          let addRecordCommand = new ImportRecordCommand(this.recordService, this.newRecordModelList, this.categoryId);
          this.commandService.do(addRecordCommand);

          this.chart.update();

          console.log(this.chart.data.datasets);
        }, (error: NgxCSVParserError) => {
          console.log('Error', error);
        });
    } else {
      alert("File not supported!")
    }
  }

  onEdit(record: RecordModel, category: CategoryModel): void {
    console.log(record);
    this.modal.open(UpdateRecordComponent, {
      width: '400px',
      maxHeight: '100vh',
      data: [record, category]
    });
  }

  undo(): void {
    this.commandService.undo();
  }
}

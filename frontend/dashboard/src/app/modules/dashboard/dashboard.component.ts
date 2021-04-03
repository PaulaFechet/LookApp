import { Component, OnInit, PLATFORM_INITIALIZER } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  chart: Chart;
  chartPie: Chart;

  constructor() { }

  ngOnInit() {
    new Chart("line-chart", {
      type: 'line',
      data: {
        labels: [1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050],
        datasets: [{
          data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478],
          label: "Africa",
          borderColor: "#3e95cd",
          fill: false
        }, {
          data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 5267],
          label: "Asia",
          borderColor: "#8e5ea2",
          fill: false
        }, {
          data: [168, 170, 178, 190, 203, 276, 408, 547, 675, 734],
          label: "Europe",
          borderColor: "#3cba9f",
          fill: false
        }, {
          data: [40, 20, 10, 16, 24, 38, 74, 167, 508, 784],
          label: "Latin America",
          borderColor: "#e8c3b9",
          fill: false
        }, {
          data: [6, 3, 2, 2, 7, 26, 82, 172, 312, 433],
          label: "North America",
          borderColor: "#c45850",
          fill: false
        }
        ],

      },
      options: {
        title: {
          display: true,
          text: 'World population per region (in millions)'
        }
      },
    });
    this.chartPie = new Chart('bar-chart', {
      type: 'bar',
      data: {
        labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
            data: [2478, 5267, 734, 784, 433]
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Predicted world population (millions) in 2050'
        }
      }
    });
    this.chart = new Chart('canvas', {
      type: 'line',
      options: {
        onClick: function(e) {
          let x = this.chart.scales["x-axis-0"].getValueForPixel(e.offsetX)
          let y = this.chart.scales["y-axis-0"].getValueForPixel(e.offsetY)

          let insertPosition = this.getInsertPosition(this.chart.data.datasets[1].data, x)

          this.chart.data.datasets[1].data.splice(insertPosition, 0, {x: x, y: y});
          this.chart.update();
        },
        scales: {
          xAxes: [{
              type: "linear",
              ticks: {
                  max: 5000,
                  min: 0,
                  stepSize: 500
              }
          }]
        },
        responsive: true,
        title: {
          display: true,
          text: 'Combo Bar and line Chart'
        },
      },
      data: {
        datasets: [
          {
            type: 'line',
            label: 'My First dataset',
            data: [
              {x: 0, y: 500},
              {x: 500, y: 300},
              {x: 700, y: 1000},
              {x: 1000, y: 500},
              {x: 3000, y: 800}
            ],
            backgroundColor: 'rgba(255,0,255,0.4)',
            borderColor: 'rgba(255,0,255,0.4)',
            fill: false,
          },
          {
            type: 'line',
            label: 'My Second dataset',
            data: [
              {x: 0, y: 1000},
              {x: 500, y: 700},
              {x: 700, y: 600},
              {x: 1000, y: 500},
              {x: 3000, y: 0}
            ],
            backgroundColor: 'rgba(0,0,255,0.4)',
            borderColor: 'rgba(0,0,255,0.4)',
            fill: false,
          }
        ]
      }
    });

    Chart.prototype['getInsertPosition'] = this.getInsertPosition

    // setInterval(() => {
    //   let min = 0
    //   let max = 5000
    //   let newValX = Math.floor(Math.random() * (max - min + 1) + min)

    //   min = 0
    //   max = 5000
    //   let newValY = Math.floor(Math.random() * (max - min + 1) + min)

    //   this.chart.data.datasets[1].data.splice(3, 0, {x: newValX, y: newValY})
    //   this.chart.update()
    // }, 1000);
  }

  public chartOnClickHandler() {
    return ((getInsertPosition) => {
      return function(e) {
        let x = this.chart.scales["x-axis-0"].getValueForPixel(e.offsetX)
        let y = this.chart.scales["y-axis-0"].getValueForPixel(e.offsetY)

        let insertPosition = getInsertPosition(this.chart.data.datasets[1].data, x)

        this.chart.data.datasets[1].data.splice(insertPosition, 0, {x: x, y: y});
        this.chart.update();
      }
    })(this.getInsertPosition)
  }

  public getInsertPosition(data: any[], newX: number) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].x > newX) {
        return i
      }
    }

    return data.length
  }
}

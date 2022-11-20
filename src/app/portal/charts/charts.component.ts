import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

// @ts-ignore
import { EChartOption, ECharts } from 'echarts';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartsComponent implements OnInit {
  public options!: EChartOption;
  public options1!: EChartOption;

  private chart!: ECharts;

  constructor() {
  }

  public ngOnInit(): void {
    this.options = {
      legend: {
        data: ['Графік води'],
        show: false,
        itemHeight: 32
      },
      tooltip: {},
      xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Графік води',
          type: 'bar',
          data: [440, 700, 488, 1000, 1290, 600, 500],
          animationDelay: (idx: number) => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };

    this.options1 = {
      legend: {
        data: ['Графік газу'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
      },
      color: ['orange'],
      series: [
        {
          name: 'Графік газу',
          type: 'bar',
          data: [50, 100, 39, 200, 300, 90, 75],
          animationDelay: (idx: number) => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };
  }

  public test(): void {
    this.chart.dispatchAction({
      type: 'legendToggleSelect',
      name: this.options.series![0].name
    });
  }

  public initChart(chart: ECharts): void {
    this.chart = chart;
  }
}

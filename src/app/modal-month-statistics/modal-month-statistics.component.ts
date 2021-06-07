import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from '../services/activity.service';
import { Location } from '@angular/common';
import * as d3 from 'd3';
@Component({
  selector: 'app-modal-month-statistics',
  templateUrl: './modal-month-statistics.component.html',
  styleUrls: ['./modal-month-statistics.component.scss'],
})
export class ModalMonthStatisticsComponent implements OnInit {
  moi;
  carteId;
  nbreHeuresMoi = 0;
  statisticsMonthSelected = [];
  nbreJoursMoinsHuit = 0;
  nbreJoursAbscence = 0;
  daysTimesatamps = [];
  days = [];
  svgMonth;

  private margin = 50;
  private width = 750 - this.margin * 2;
  private height = 400 - this.margin * 2;
  statisticsMonth;
  nowMonth: number;
  nowYear: any;
  NbMoisPasse: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private activityService: ActivityService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.carteId = this.activatedRoute.snapshot.paramMap.get('carteId');
    this.moi = this.activatedRoute.snapshot.paramMap.get('moi');
    console.log(this.moi);
    this.getMonthSelectedStatistics(this.moi);
    this.getNbreHoursMonthSelected();
    this.createSvg();
    this.drawBars(this.mapDataMonth());
  }

  mapDataMonth() {
    let outPutArray = [];
    this.statisticsMonthSelected.map((element, key) => {
      element = { day: key + 1, nbrHours: element };
      outPutArray.push(element);
    });
    console.log(outPutArray);
    return outPutArray;
  }
  private createSvg(): void {
    this.svgMonth = d3
      .select('figure#barForMonth')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }
  getMonthSelectedStatistics(evt) {
    var now = new Date(evt);
    var MonthArgument;
    var length = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= length; i++) {
      this.days.push(i);
    }

    MonthArgument = -1 * Date.parse(evt);
    console.log('monthArgument', MonthArgument);
    console.log('timestamp selected', now);
    var timestamp = MonthArgument.toString();
    for (let i = 1; i <= length; i++) {
      this.daysTimesatamps.push(timestamp);
      var tp = parseInt(timestamp) - 8.64 * 10000000;
      timestamp = tp.toString();
    }

    this.daysTimesatamps.forEach((element, key) => {
      var NbOfHours;
      if (key == length - 1) {
        NbOfHours = this.activityService.getStatisticsByMonth(
          this.carteId,
          element,
          parseInt(timestamp).toString()
        );
        this.nbreHeuresMoi = this.nbreHeuresMoi + NbOfHours;
      } else {
        NbOfHours = this.activityService.getStatisticsByMonth(
          this.carteId,
          element,
          this.daysTimesatamps[key + 1]
        );
        this.nbreHeuresMoi = this.nbreHeuresMoi + NbOfHours;
      }
      if (!NbOfHours) {
        this.nbreJoursAbscence++;
      }
      if (NbOfHours != null) {
        this.statisticsMonthSelected.push(NbOfHours);
        if (NbOfHours < 8 && NbOfHours > 0) {
          this.nbreJoursMoinsHuit++;
        }
      }
    });
  }

  drawBars(data: any[]): void {
    let colors = [
      '#83e4e2',
      '#160C28',
      '#FFFFFF',
      '#D74E09',
      '#40587A',
      '#83e4e2',
      '#160C28',
      '#FFFFFF',
      '#D74E09',
      '#40587A',
      '#83e4e2',
      '#160C28',
      '#83e4e2',
      '#160C28',
      '#FFFFFF',
      '#D74E09',
      '#40587A',
      '#83e4e2',
      '#160C28',
      '#FFFFFF',
      '#D74E09',
      '#40587A',
      '#83e4e2',
      '#160C28',
      '#83e4e2',
      '#160C28',
      '#FFFFFF',
      '#D74E09',
      '#40587A',
    ];
    // Create the X-axis band scale
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d.day))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svgMonth
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create the Y-axis band scale
    const y = d3.scaleLinear().domain([0, 14]).range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svgMonth.append('g').call(d3.axisLeft(y));

    // Create and fill the bars
    this.svgMonth
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.day))
      .attr('y', (d) => y(d.nbrHours))
      .attr('width', x.bandwidth())
      .attr('height', (d) => this.height - y(d.nbrHours))
      .attr('fill', function (d, i) {
        return colors[i];
      })
      .attr('id', function (d, i) {
        return i;
      })
      .on('mouseover', function () {
        d3.select(this).attr('fill', 'red');
      })
      .on('mouseout', function (d, i) {
        d3.select(this).attr('fill', function () {
          return colors[this.id];
        });
      })
      .append('title')
      .text(function (d) {
        return d.nbrHours;
      });
  }
  mapDataMmonth() {}

  getNbreHoursMonthSelected() {
    var firstArg = new Date(this.moi);
    var lastDayArg = new Date(
      firstArg.getFullYear(),
      firstArg.getMonth() + 1,
      0
    );
    var secondArg = -1 * Date.parse(lastDayArg.toString()) - 8.64 * 10000000;
    var a = (-1 * Date.parse(this.moi)).toString();
    var b = secondArg.toString();
    this.nbreHeuresMoi = this.activityService.getStatisticsByMonth(
      this.carteId,
      a,
      b
    );
  }

  back() {
    console.log('close clicked');
    this.location.back();
  }
}

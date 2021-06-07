import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as d3 from 'd3';
import { ActivityService } from '../services/activity.service';

import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  carteId;
  nom;
  prenom;
  monthss = [];
  statisticsYear = [];
  private svg;
  private margin = 50;
  private width = 750 - this.margin * 2;
  private height = 400 - this.margin * 2;
  nowYear;
  months = [];
  statisticsMonth = [];
  days = [];
  nowMonth;
  daysTimesatamps = [];
  svgMonth;
  anneeActuelle: any;
  NbMoisPasse: number = 0;
  NumberOfHoursYear: any;
  MoyenneMois: number = 0;
  MoyenneSemaine: number = 0;
  NumberOfHoursMonth: number = 0;
  MoinsHuitMois: number = 0;
  barYearModal = false;
  carteIdParam = 'TY 76 87 8H';
  anneeParam = '2020';

  constructor(
    private activatedRoute: ActivatedRoute,
    private activityService: ActivityService,
    private router: Router,
    private location: Location,
    private _snackBar: MatSnackBar
  ) {
    this.nowYear = new Date().getFullYear();
    this.nowMonth = new Date().getMonth() + 1;
    this.anneeActuelle = this.nowYear.valueOf();
    this.getMonths();
  }

  ngOnInit() {
    this.carteId = this.activatedRoute.snapshot.paramMap.get('carteId');
    this.nom = this.activatedRoute.snapshot.paramMap.get('nom');
    this.prenom = this.activatedRoute.snapshot.paramMap.get('prenom');
    for (let i = 1; i <= this.nowMonth; i++) {
      this.monthss.push(
        this.nowYear.toString() + '-0' + i.toString().toString()
      );
      this.NbMoisPasse++;
    }
    this.monthss.map((element) => console.log('mmoi', element));
    this.getCurrentYearStatistics();
    this.getCurrentMonthDays();
    this.mapDataYears();
    this.mapDataMonth();
    this.createSvg();
    this.createSvgMonth();
    this.drawBars(this.mapDataYears());
    this.drawBarsMonth(this.mapDataMonth());
    this.statisticsYear.forEach((element) => {
      console.log(element);
    });
    this.getCurrentYear();
    this.nbHeureMois();
    this.moyenneHeures();
    this.moinsHuitHeures();
  }

  mapDataYears() {
    // try to make this array look like this.data array
    let outPutArray = [];
    let months = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juiller',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    this.statisticsYear.map((element, key) => {
      element = { month: months[key], nbrHours: element };
      outPutArray.push(element);
    });

    console.log(outPutArray);
    return outPutArray;
  }

  mapDataMonth() {
    let outPutArray = [];
    this.statisticsMonth.map((element, key) => {
      element = { day: key + 1, nbrHours: element };
      outPutArray.push(element);
    });
    console.log(outPutArray);
    return outPutArray;
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#bar')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }
  private createSvgMonth(): void {
    this.svgMonth = d3
      .select('figure#barMonth')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }
  private drawBars(data: any[]): void {
    let colors = [
      '#EFCB68',
      '#83e4e2',
      '#FFFFFF',
      '#D74E09',
      '#40587A',
      '#EFCB68',
      '#83e4e2',
      '#FFFFFF',
      '#D74E09',
      '#40587A',
      '#EFCB68',
      '#83e4e2',
    ];
    // Create the X-axis band scale
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(data.map((d) => d.month))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create the Y-axis band scale
    const y = d3.scaleLinear().domain([0, 210]).range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append('g').call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg
      .selectAll('bars')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.month))
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

  private drawBarsMonth(data: any[]): void {
    let colors = [
      '#EFCB68',
      '#83e4e2',
      '#FFFFFF',
      '#D74E09',
      '#40587A',
      '#EFCB68',
      '#83e4e2',
      '#FFFFFF',
      '#D74E09',
      '#40587A',
      '#EFCB68',
      '#83e4e2',
      '#EFCB68',
      '#83e4e2',
      '#FFFFFF',
      '#D74E09',
      '#40587A',
      '#EFCB68',
      '#83e4e2',
      '#FFFFFF',
      '#D74E09',
      '#40587A',
      '#EFCB68',
      '#83e4e2',
      '#EFCB68',
      '#83e4e2',
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

  getMonths() {
    for (let i = 1; i <= 12; i++) {
      var month = (
        -1 * Date.parse(this.nowYear.toString() + '-0' + i.toString())
      ).toString();
      console.log(typeof month);
      this.months.push(month);
    }
  }

  getCurrentYear() {
    var year = -1 * Date.parse(this.nowYear.toString());
    console.log(year);
    var yearString = year.toString();
    this.NumberOfHoursYear = this.activityService.getStatisticsCurrentYear(
      this.carteId,
      yearString
    );
    return this.NumberOfHoursYear;
  }
  moyenneHeures() {
    this.MoyenneMois = Math.floor(this.NumberOfHoursYear / this.NbMoisPasse);
    this.MoyenneSemaine = Math.floor(
      this.NumberOfHoursYear / (this.NbMoisPasse * 4.35)
    );
    console.log('moyene semaine ', this.NbMoisPasse);
  }

  moinsHuitHeures() {
    const myArray = this.statisticsMonth.filter((elt) => elt < 8 && elt > 0);
    myArray.forEach((elet) => {
      this.MoinsHuitMois++;
    });
  }
  nbHeureMois() {
    const myArray = this.statisticsYear.filter((element) => element > 0);
    myArray.map((elt) => {
      console.log(elt);
    });
    this.NumberOfHoursMonth = myArray[myArray.length - 1];
    console.log(this.NumberOfHoursMonth);
  }

  getCurrentYearStatistics() {
    this.months.forEach((element, key) => {
      var NbOfHours;
      if (key < 11) {
        NbOfHours = this.activityService.getStatisticsByMonth(
          this.carteId,
          element,
          this.months[key + 1]
        );
        if (NbOfHours != null) {
          this.statisticsYear.push(NbOfHours);
        }
      } else if (key == 11) {
        NbOfHours = this.activityService.getStatisticsByMonth(
          this.carteId,
          element,
          element + 24 * 31 * 3.6 * 1000000
        );
        if (NbOfHours != null) {
          this.statisticsYear.push(NbOfHours);
        }
      }
    });
  }

  getCurrentMonthDays() {
    var now = new Date();
    var length = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= length; i++) {
      this.days.push(i);
    }

    if (this.nowMonth < 10) {
      this.nowMonth = (
        -1 *
        Date.parse(this.nowYear.toString() + '-0' + this.nowMonth.toString())
      ).toString();
    } else if (this.nowMonth > 10) {
      this.nowMonth = (
        -1 * Date.parse(this.nowYear.toString() + this.nowMonth.toString())
      ).toString();
    }
    var timestamp = this.nowMonth;
    for (let i = 1; i <= length; i++) {
      this.daysTimesatamps.push(timestamp);
      var tp = parseInt(timestamp) - 8.64 * 10000000;
      timestamp = tp.toString();
    }

    this.daysTimesatamps.forEach((element, key) => {
      console.log(typeof element);
      var NbOfHours;
      if (key == length - 1) {
        NbOfHours = this.activityService.getStatisticsByMonth(
          this.carteId,
          element,
          (parseInt(timestamp) - 8.64 * 10000000).toString()
        );
      } else {
        NbOfHours = this.activityService.getStatisticsByMonth(
          this.carteId,
          element,
          this.daysTimesatamps[key + 1]
        );
      }
      if (NbOfHours != null) {
        this.statisticsMonth.push(NbOfHours);
      }
    });
  }

  onOptionsSelected(event) {
    if (event) {
      console.log(new Date(event));
      this.router.navigate(['/statisticsModal', this.carteId, event]);
    }
  }

  onOptionsMonthSelected(event) {
    if (event) {
      console.log(new Date(event));
      this.router.navigate(['/statisticsMonthModal', this.carteId, event]);
    }
  }

  back() {
    console.log('close clicked');
    this.location.back();
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from '../services/activity.service';
import { Location } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-modal-year-statistics',
  templateUrl: './modal-year-statistics.component.html',
  styleUrls: ['./modal-year-statistics.component.scss'],
})
export class ModalYearStatisticsComponent implements OnInit {
  carteId: string;
  annee: string;
  MoyenneMois = 0;
  MoyenneSemaine = 0;
  NbreHeureAnnee = 0;
  statisticsYear = [];
  months = [];
  private margin = 50;
  private width = 750 - this.margin * 2;
  private height = 400 - this.margin * 2;
  svg;
  constructor(
    private activityService: ActivityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.carteId = this.activatedRoute.snapshot.paramMap.get('carteId');
    this.annee = this.activatedRoute.snapshot.paramMap.get('year');
    this.getMonths();
    this.getCurrentYearStatistics();
    this.nbreHeureAnnee();
    this.moyenneHeures();
    this.createSvg();
    this.drawBars(this.mapDataYears());
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
  moyenneHeures() {
    this.MoyenneMois = Math.ceil(this.NbreHeureAnnee / 12);
    this.MoyenneSemaine = Math.ceil(this.NbreHeureAnnee / (12 * 4.35));
  }

  nbreHeureAnnee() {
    this.statisticsYear.forEach((elt) => {
      console.log(elt);
      this.NbreHeureAnnee += elt;
    });
  }
  getMonths() {
    for (let i = 1; i <= 12; i++) {
      var month = (
        -1 * Date.parse(this.annee.toString() + '-0' + i.toString())
      ).toString();
      console.log(typeof month);
      this.months.push(month);
    }
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

  private drawBars(data: any[]): void {
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

  private createSvg(): void {
    this.svg = d3
      .select('figure#bAR')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  back() {
    console.log('close clicked');
    this.location.back();
  }
}

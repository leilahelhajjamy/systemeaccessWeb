import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireObject,
  AngularFireList,
  snapshotChanges,
} from '@angular/fire/database';

class Activity {
  timestamp: Date;
  type: string;
}

class ActivityT {
  timestamp: number;
  type: string;
}

class ActivityData {
  timestamp: number;
  type: string;
  carteId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  NumberOfHoursCurrentMonth;
  NumberOfHours;
  NumberOfHoursCurrentYear;
  nom;
  prenom;
  activityListRef: AngularFireList<any>;
  activityObjectRef: AngularFireObject<any>;
  constructor(public db: AngularFireDatabase) {}

  getActivityByUser(carteId) {
    var activities;
    activities = [];
    this.db
      .object(`/activities/${carteId}/`)
      .query.orderByChild('timestamp')
      .on('value', (snapshot) => {
        snapshot.forEach((snap) => {
          activities.push({
            timestamp: new Date(-1 * snap.val().timestamp)
              .toString()
              .replace('GMT+0200', '')
              .replace('(heure d’été d’Europe centrale)', '')
              .replace('Z', '')
              .replace('GMT+0100 (heure normale d’Europe centrale)', ''),
            type: snap.val().type,
          });
        });
      });

    return activities;
  }

  getActivitiesByMonth(carteId, monthStart, monthEnd) {
    var activities;
    activities = [];
    var activitiesReverse;

    console.log('start fetching');
    this.db
      .object(`/activities/${carteId}`)
      .query.orderByKey()
      .startAt(monthStart)
      .endAt(monthEnd)
      .on('value', (snapshot) => {
        snapshot.forEach((snap) => {
          activities.push({
            timestamp: new Date(-1 * snap.val().timestamp)
              .toString()
              .replace('GMT+0200', '')
              .replace('(heure d’été d’Europe centrale)', '')
              .replace('Z', '')
              .replace('GMT+0100 (heure normale d’Europe centrale)', ''),
            type: snap.val().type,
            carteId: snap.val().carteId,
            nom: this.nom,
            prenom: this.prenom,
            poste: '',
          });
          activities.map((element) => {
            this.db
              .object(`/users/${element.carteId}`)
              .query.orderByKey()
              .on('value', (snapshot) => {
                snapshot.forEach((snap) => {
                  element.nom = snap.val().nom;
                  element.prenom = snap.val().prenom;
                  element.poste = snap.val().poste;
                });
              });
          });
        });
      });
    console.log(activities);
    activitiesReverse = activities.reverse();
    return activitiesReverse;
  }

  getActivitiesCurrentMonth(carteId, month) {
    var activities;
    activities = [];
    var activitiesReverse;

    console.log('start fetching');
    this.db
      .object(`/activities/${carteId}`)
      .query.orderByKey()
      .startAt(month)
      .on('value', (snapshot) => {
        snapshot.forEach((snap) => {
          activities.push({
            timestamp: new Date(-1 * snap.val().timestamp)
              .toString()
              .replace('GMT+0200', '')
              .replace('(heure d’été d’Europe centrale)', '')
              .replace('Z', '')
              .replace('GMT+0100 (heure normale d’Europe centrale)', ''),
            type: snap.val().type,
            carteId: snap.val().carteId,
            nom: this.nom,
            prenom: this.prenom,
            poste: '',
          });
          activities.map((element) => {
            this.db
              .object(`/users/${element.carteId}`)
              .query.orderByKey()
              .on('value', (snapshot) => {
                snapshot.forEach((snap) => {
                  element.nom = snap.val().nom;
                  element.prenom = snap.val().prenom;
                  element.poste = snap.val().poste;
                });
              });
          });
        });
      });
    console.log(activities);
    activitiesReverse = activities.reverse();
    return activitiesReverse;
  }

  getStatisticsByMonth(carteId, monthStart, monthEnd) {
    var activities = [
      {
        timestamp: null,
        type: '',
      },
    ];
    var activitiesDif;
    var sigmaIn = 0;
    var sigmaOut = 0;

    this.db
      .object(`/activities/${carteId}/`)
      .query.orderByKey()
      .startAfter(monthStart)
      .endBefore(monthEnd)
      .on('value', (snapshot) => {
        snapshot.forEach((snap) => {
          activities.push({
            timestamp: snap.val().timestamp,
            type: snap.val().type,
          });
        });

        if (activities[0].type == 'IN') {
          activities.shift();
          if (activities[activities.length].type == 'OUT') {
            activities.pop();
          }

          activities.forEach((element) => {
            if (element.type == 'IN') {
              sigmaIn += element.timestamp;
            } else {
              sigmaOut += element.timestamp;
            }
          });

          activitiesDif = sigmaIn - sigmaOut;

          this.NumberOfHours = Math.floor(activitiesDif / (3.6 * 1000000));
          console.log(this.NumberOfHours);
          return this.NumberOfHours;
        } else {
          activities.forEach((element) => {
            if (element.type == 'IN') {
              sigmaIn += element.timestamp;
            } else if (element.type == 'OUT') {
              sigmaOut += element.timestamp;
            }
          });

          activitiesDif = sigmaIn - sigmaOut;
          this.NumberOfHours = Math.floor(activitiesDif / (3.6 * 1000000));
          return this.NumberOfHours;
        }
      });

    return this.NumberOfHours;
  }
  array_combine(keys, values): any[] {
    // eslint-disable-line camelcase
    //  discuss at: https://locutus.io/php/array_combine/
    // original by: Kevin van Zonneveld (https://kvz.io)
    // improved by: Brett Zamir (https://brett-zamir.me)
    //   example 1: array_combine([0,1,2], ['kevin','van','zonneveld'])
    //   returns 1: {0: 'kevin', 1: 'van', 2: 'zonneveld'}
    const newArray = [];
    let i = 0;
    // input sanitation
    // Only accept arrays or array-like objects
    // Require arrays to have a count
    if (typeof keys !== 'object') {
      return [];
    }
    if (typeof values !== 'object') {
      return [];
    }
    if (typeof keys.length !== 'number') {
      return [];
    }
    if (typeof values.length !== 'number') {
      return [];
    }
    if (!keys.length) {
      return [];
    }
    // number of elements does not match
    if (keys.length !== values.length) {
      return [];
    }
    for (i = 0; i < keys.length; i++) {
      newArray[keys[i]] = values[i];
    }
    return newArray;
  }

  getStatisticsCurrentYear(carteId, yearStart) {
    var activities = [
      {
        timestamp: null,
        type: '',
      },
    ];
    var activitiesDif;
    var sigmaIn = 0;
    var sigmaOut = 0;

    console.log('start fetching');
    this.db
      .object(`/activities/${carteId}/`)
      .query.orderByKey()
      .startAfter(yearStart)
      .on('value', (snapshot) => {
        snapshot.forEach((snap) => {
          activities.push({
            timestamp: snap.val().timestamp,
            type: snap.val().type,
          });
        });

        if (activities[0].type == 'IN') {
          activities.shift();
          if (activities[activities.length].type == 'OUT') {
            activities.pop();
          }

          activities.forEach((element) => {
            if (element.type == 'IN') {
              sigmaIn += element.timestamp;
            } else {
              sigmaOut += element.timestamp;
            }
          });

          activitiesDif = sigmaIn - sigmaOut;

          this.NumberOfHoursCurrentYear = Math.floor(
            activitiesDif / (3.6 * 1000000)
          );

          return this.NumberOfHoursCurrentYear;
        } else {
          activities.forEach((element) => {
            if (element.type == 'IN') {
              sigmaIn += element.timestamp;
            } else if (element.type == 'OUT') {
              sigmaOut += element.timestamp;
            }
          });

          activitiesDif = sigmaIn - sigmaOut;

          this.NumberOfHoursCurrentYear = Math.floor(
            activitiesDif / (3.6 * 1000000)
          );

          return this.NumberOfHoursCurrentYear;
        }
      });
    return this.NumberOfHoursCurrentYear;
  }

  getNewsActivities() {
    return this.db.list('conges');
  }
}

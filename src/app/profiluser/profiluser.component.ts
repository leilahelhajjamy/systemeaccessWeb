import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from '../services/activity.service';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profiluser',
  templateUrl: './profiluser.component.html',
  styleUrls: ['./profiluser.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfiluserComponent implements OnInit {
  carteId;
  months = [];
  nowForMonth;
  jourDebut;
  jourFin;
  statisticsYear = [];

  carteID;
  nom;
  prenom;
  poste;
  authorised;
  User;
  activitiees;
  activities;
  activitiesdata = [];
  timeline;
  diff;

  CurrentMonthClicked = false;

  nowYear = new Date().getFullYear();
  nowMonth = new Date().getMonth() + 1;
  now;
  customPickerOptions: any;
  NumberOfHours;
  dateDebut;
  dateFin;
  day;
  formMonth: FormGroup;
  formNomModify: FormGroup;
  formPrenomModify: FormGroup;
  formPosteModify: FormGroup;
  formCarteIdModify: FormGroup;
  formAuthorisedModify: FormGroup;

  editNomClicked: boolean = false;
  editPrenomClicked: boolean = false;
  editPosteClicked: boolean = false;
  editCarteIdClicked: boolean = false;
  editAuthorisedClicked: boolean = false;

  messagePoste = 'le champs Poste doit contenir seulement des lettres';
  messageCarteId = 'le champs Carte ID  est invalide';
  messageNom = 'le champs Nom doit contenir seulement des lettres';
  messagePrenom = 'le champs Prénom doit contenir seulement des lettres';
  monthChoisi;
  moiSelectionne;
  searchText;
  constructor(
    public formBuilder: FormBuilder,
    private activityService: ActivityService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private location: Location
  ) {
    this.formNomModify = this.formBuilder.group({
      nom: new FormControl('', Validators.compose([Validators.required])),
    });

    this.formPrenomModify = this.formBuilder.group({
      prenom: new FormControl('', Validators.compose([Validators.required])),
    });
    this.formPosteModify = this.formBuilder.group({
      poste: new FormControl('', Validators.compose([Validators.required])),
    });

    this.formCarteIdModify = this.formBuilder.group({
      carteID: new FormControl('', Validators.compose([Validators.required])),
    });

    this.formAuthorisedModify = this.formBuilder.group({
      authorised: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
    });

    this.formMonth = this.formBuilder.group({
      monthChoisi: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
    });

    if (this.nowMonth < 10) {
      this.now =
        this.nowYear.toString() + '-0' + this.nowMonth.toString() + '-01';
    } else {
      this.now =
        this.nowYear.toString() + '-' + this.nowMonth.toString() + '-01';
    }

    if (this.nowMonth < 10) {
      this.nowForMonth =
        this.nowYear.toString() + '-0' + this.nowMonth.toString() + '-01';
    } else {
      this.nowForMonth =
        this.nowYear.toString() + '-' + this.nowMonth.toString() + '-01';
    }
  }

  ngOnInit(): void {
    this.User = {
      nom: '',
      prenom: '',
      poste: '',
      carteId: '',
      authorised: false,
      departement: '',
    };
    this.carteId = this.activatedRoute.snapshot.paramMap.get('carteId');
    this.userService
      .getUser(this.carteId)
      .valueChanges()
      .subscribe((res) => {
        this.User.nom = res['3'];
        this.User.prenom = res['5'];
        this.User.carteId = res['1'];
        this.User.poste = res['4'];
        this.User.authorised = res['0'];
        this.User.departement = res['2'];
        this.authorised = res['0'];
        console.log(this.User.authorised);
      });

    for (let i = 1; i <= this.nowMonth; i++) {
      this.months.push(
        this.nowYear.toString() + '-0' + i.toString().toString()
      );
    }

    this.months.forEach((element) => {
      console.log(element);
    });

    setTimeout(() => {
      this.getActivityByUser();
      this.getActivitiesCurrentMonth();
    }, 2000);
  }

  getActivityByUser() {
    this.activities = this.activityService.getActivityByUser(this.carteId);
    console.log(this.activities);
  }

  EditNomClicked() {
    this.editNomClicked = true;
  }
  EditPrenomClicked() {
    this.editPrenomClicked = true;
  }
  EditPosteClicked() {
    this.editPosteClicked = true;
  }
  EditCarteIdClicked() {
    this.editCarteIdClicked = true;
  }
  EditAuthorisedClicked() {
    this.editAuthorisedClicked = true;
  }

  AnnulerEditNomClicked() {
    this.editNomClicked = false;
  }
  AnnulerEditPrenomClicked() {
    this.editPrenomClicked = false;
  }
  AnnulerEditPosteClicked() {
    this.editPosteClicked = false;
  }
  AnnulerEditCarteIdClicked() {
    this.editCarteIdClicked = false;
  }
  AnnulerEditAuthorisedClicked() {
    this.editAuthorisedClicked = false;
  }

  supprimerUser() {
    // add confirm delete
    this.userService.supprimerUser(this.carteId);
  }
  async filterList(day) {
    const searchTerm = day;
    console.log(day);
    if (!searchTerm) {
      return;
    }

    this.activitiees = this.activitiees.filter((activity) => {
      if (activity.timestamp && searchTerm) {
        return (
          activity.timestamp
            .split(' ')[2]
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase()) > -1
        );
      } else {
        return true;
      }
    });
  }

  async modifierCarteId() {
    if (this.carteID != null) {
      var carteIdSplit = this.carteID.split(' ');
      if (carteIdSplit.length == 4) {
        if (
          carteIdSplit[0].length != 2 ||
          carteIdSplit[1].length != 2 ||
          carteIdSplit[2].length != 2 ||
          carteIdSplit[3].length != 2
        ) {
          this.toast(this.messageCarteId);
        } else {
          if (
            /^([A-Z]+)$/.test(carteIdSplit[0]) == false ||
            /^([0-9]+)$/.test(carteIdSplit[1]) == false ||
            /^([0-9]+)$/.test(carteIdSplit[2]) == false ||
            /^([0-9][A-Z]+)$/.test(carteIdSplit[3]) == false
          ) {
            this.toast(this.messageCarteId);
          } else {
            this.User.carteId = this.carteID;
            this.userService.modifierCarteId(this.User, this.carteId);
            this.toastSuccess();
            this.router.navigate([`/profiluser/${this.carteID}`]);
            this.AnnulerEditCarteIdClicked();
          }
        }
      } else {
        this.toast(this.messageCarteId);
      }
    } else {
      this.toast('Veuillez saisir un ID de carte');
    }
  }

  async modifierPoste() {
    if (this.poste != null) {
      if (/^[A-zÀ-ú_ ]*$/.test(this.poste) == false) {
        this.toast(this.messagePoste);
      } else {
        this.userService.modifierPoste(this.carteId, this.poste);
        this.toastSuccess();
        this.AnnulerEditPosteClicked();
      }
    } else {
      this.toast('Veuillez saisir un poste');
    }
  }
  async modifierPrenom() {
    if (this.prenom != null) {
      if (/^[A-zÀ-ú_ ]*$/.test(this.prenom) == false) {
        this.toast(this.messagePrenom);
      } else {
        this.userService.modifierPrenom(this.carteId, this.prenom);
        this.toastSuccess();
        this.AnnulerEditPrenomClicked();
      }
    } else {
      this.toast('Veuillez saisir un prénom');
    }
  }
  async modifierNom() {
    if (this.nom!) {
      if (/^[A-zÀ-ú_ ]*$/.test(this.nom) == false) {
        this.toast(this.messageNom);
      } else {
        this.userService.modifierNom(this.carteId, this.nom);
        this.toastSuccess();
        this.AnnulerEditNomClicked();
      }
    } else {
      this.toast('Veuillez saisir un nom ');
    }
  }

  async modifierAuthorised() {
    this.userService.modifierAuthorised(this.carteId, this.authorised);
    this.AnnulerEditAuthorisedClicked();
    this.toastSuccess();
  }

  toastSuccess() {
    this._snackBar.open('Modifié avec succés', 'Cancel', {
      duration: 2000,
      // here specify the position
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  onChange(evt) {
    this.moiSelectionne = evt.value;
    console.log(new Date(this.moiSelectionne));
    console.log(
      new Date(
        this.moiSelectionne.split('-')[0],
        this.moiSelectionne.split('-')[1],
        0
      )
    );

    if (!evt) {
      this.getActivitiesCurrentMonth();
    }
    this.activities = [];
    var MonthAfter;
    var MonthActuel;
    var Month;
    var monthSplit;
    var MonthArgument;
    var MonthAfterArgument;
    monthSplit = evt.value.split('-');
    MonthActuel = parseInt(monthSplit[1]);
    Month = monthSplit[0] + '-' + monthSplit[1] + '-01T00:00:00.000+01:00';
    Month = Date.parse(Month);
    if (MonthActuel < 12) {
      MonthAfter = parseInt(monthSplit[1]) + 1;
      if (MonthAfter < 10) {
        MonthAfter = '0' + MonthAfter.toString();
        MonthAfter =
          monthSplit[0] + '-' + MonthAfter + '-01T00:00:00.000+01:00';
        MonthAfter = Date.parse(MonthAfter);
      }
    } else if (MonthActuel == 12) {
      MonthAfter = parseInt(monthSplit[1]);
      if (MonthAfter < 10) {
        MonthAfter = '0' + MonthAfter.toString();
        MonthAfter =
          monthSplit[0] + '-' + MonthAfter + '-31T23:59:59.000+01:00';

        MonthAfter = Date.parse(MonthAfter);
      }
    }

    MonthArgument = (-1 * Month).toString();
    MonthAfterArgument = (-1 * MonthAfter).toString();

    console.log(Month.toString());
    this.activitiees = this.activityService.getActivitiesByMonth(
      this.carteId,
      MonthArgument,
      MonthAfterArgument
    );
  }

  getActivitiesCurrentMonth() {
    var month = -1 * Date.parse(this.nowForMonth);
    console.log(month);
    var monthString = month.toString();
    this.activitiees = this.activityService.getActivitiesCurrentMonth(
      this.carteId,
      monthString
    );
  }

  StatisticsPage(carteId, nom, prenom) {
    this.router.navigate(['/statistics', carteId, nom, prenom]);
  }

  minJour() {
    var Jour;
    var DernierJour;
    if (this.moiSelectionne) {
      Jour = new Date(this.moiSelectionne);
      DernierJour = new Date(
        new Date(
          this.moiSelectionne.split('-')[0],
          this.moiSelectionne.split('-')[1],
          0
        )
      );
    } else {
      this.moiSelectionne =
        this.nowForMonth.split('-')[0] + '-' + this.nowForMonth.split('-')[1];
      Jour = new Date(this.moiSelectionne);
      DernierJour = new Date(
        new Date(
          this.moiSelectionne.split('-')[0],
          this.moiSelectionne.split('-')[1],
          0
        )
      );
    }
    return Jour;
  }
  // filter selection

  maxJour() {
    var Jour;
    var DernierJour;
    if (this.moiSelectionne) {
      Jour = new Date(this.moiSelectionne);
      DernierJour = new Date(
        new Date(
          this.moiSelectionne.split('-')[0],
          this.moiSelectionne.split('-')[1],
          0
        )
      );
    } else {
      this.moiSelectionne =
        this.nowForMonth.split('-')[0] + '-' + this.nowForMonth.split('-')[1];
      Jour = new Date(this.moiSelectionne);
      DernierJour = new Date(
        new Date(
          this.moiSelectionne.split('-')[0],
          this.moiSelectionne.split('-')[1],
          0
        )
      );
    }

    return DernierJour;
  }

  async toast(message) {
    this._snackBar.open(message, 'Cancel', {
      duration: 2000,
      // here specify the position
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  back() {
    console.log('close clicked');
    this.location.back();
  }
}

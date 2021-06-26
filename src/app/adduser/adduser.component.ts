import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivityService } from '../services/activity.service';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss'],
})
export class AdduserComponent implements OnInit {
  @Input() listUsersDom: boolean;
  @Output() listUsersDomChanged: EventEmitter<boolean> = new EventEmitter();

  users: Observable<any>;
  formUserAdd: FormGroup;
  nom: string;
  prenom;
  poste: string;
  carteId: string;
  departement: string;
  photoURL: string;
  public authorised: boolean;
  public checkedState: boolean;

  messagePoste = 'le champs Poste doit contenir seulement des lettres';
  messageChamps = 'Veuillez remplir tous les champs';
  messageCarteId = 'le champs Carte ID  est invalide';
  messageNom = 'le champs Nom doit contenir seulement des lettres';
  messagePrenom = 'le champs Prénom doit contenir seulement des lettres';
  validatedNom: boolean = true;
  validatedPrenom: boolean = true;
  validatedPoste: boolean = true;
  constructor(
    public router: Router,
    public activityService: ActivityService,
    public formBuilder: FormBuilder,
    public db: AngularFireDatabase,
    public userService: UserService,
    private _snackBar: MatSnackBar
  ) {
    this.authorised = true;
    this.checkedState = true;

    this.formUserAdd = this.formBuilder.group({
      nom: new FormControl('', Validators.compose([Validators.required])),
      prenom: new FormControl('', Validators.compose([Validators.required])),
      poste: new FormControl('', Validators.compose([Validators.required])),
      carteId: new FormControl('', Validators.required),
      authorised: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      departement: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
    });
  }

  ngOnInit(): void {}
  async ajouter() {
    var carteIdSplit: string[];
    console.log(
      this.nom,
      this.prenom,
      this.poste,
      this.carteId,
      this.departement
    );
    if (
      this.nom != null &&
      this.prenom != null &&
      this.carteId != null &&
      this.poste != null &&
      this.departement != null
    ) {
      if (/^[A-zÀ-ú_ ]*$/.test(this.nom) == false) {
        this.toast(this.messageNom);
        this.validatedNom = false;
      }

      if (/^[A-zÀ-ú_ ]*$/.test(this.prenom) == false) {
        this.toast(this.messagePrenom);
        this.validatedPrenom = false;
      }

      if (/^[A-zÀ-ú_ ]*$/.test(this.poste) == false) {
        this.toast(this.messagePoste);
        this.validatedPoste = false;
      }

      carteIdSplit = this.carteId.split(' ');
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
            /^([a-zA-Z0-9]+)$/.test(carteIdSplit[0]) == false ||
            /^([a-zA-Z0-9]+)$/.test(carteIdSplit[1]) == false ||
            /^([a-zA-Z0-9]+)$/.test(carteIdSplit[2]) == false ||
            /^([a-zA-Z0-9]+)$/.test(carteIdSplit[3]) == false
          ) {
            this.toast(this.messageCarteId);
          } else {
            if (
              this.validatedNom &&
              this.validatedPrenom &&
              this.validatedPoste
            ) {
              this.userService.save(
                this.nom,
                this.prenom,
                this.poste,
                this.carteId,
                this.authorised,
                this.departement
              );
              this.toast('crée avec succés');
              this.listUsersDomChanged.emit(true);
            }
          }
        }
      } else {
        this.toast(this.messageCarteId);
      }
    } else {
      this.toast(this.messageChamps);
    }
  }

  async toast(message) {
    this._snackBar.open(message, 'Cancel', {
      duration: 2000,
      // here specify the position
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  annulerAjout() {
    this.listUsersDom = true;
    this.listUsersDomChanged.emit(this.listUsersDom);
  }
}

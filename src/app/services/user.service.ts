import { query } from '@angular/animations';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireObject,
  AngularFireList,
  snapshotChanges,
} from '@angular/fire/database';
import { EmailValidator } from '@angular/forms';

export class User {
  constructor() {
    this.nom = '';
    this.prenom = '';
    this.poste = '';
    this.carteId = '';
    this.authorised = true;
    this.departement = '';
  }
  nom: string;
  prenom: string;
  poste: string;
  carteId: string;
  authorised: boolean;
  departement: string;
}
export class Responsable {
  constructor() {
    this.nom = '';
    this.etat = '';
    this.departement = '';
    this.email = '';
    this.password = '';
    this.photoURL = '';
  }
  nom: string;
  etat: string;
  email: string;
  password: string;
  photoURL: string;
  departement: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  UserData: User = {
    nom: '',
    prenom: '',
    poste: '',
    carteId: '',
    authorised: false,
    departement: '',
  };
  usersListRef: AngularFireList<any>;
  usersResponsablesRef: AngularFireList<any>;
  usersObjectRef: AngularFireObject<any>;
  constructor(public db: AngularFireDatabase) {
    this.usersListRef = this.db.list('/users');
    this.usersObjectRef = this.db.object('/users/');
  }

  getUsersList() {
    this.usersListRef = this.db.list('/users');
    return this.usersListRef;
  }

  save(
    nom: string,
    prenom: string,
    poste: string,
    carteId: string,
    authorised: boolean,
    departement: string
  ) {
    this.UserData.nom = nom;
    this.UserData.prenom = prenom;
    this.UserData.carteId = carteId;
    this.UserData.poste = poste;
    this.UserData.authorised = authorised;
    this.UserData.departement = departement;
    this.usersListRef = this.db.list(`/users/${carteId}`);
    this.usersListRef.push(this.UserData);
    this.usersObjectRef = this.db.object(`/users/${carteId}`);
    this.usersObjectRef.set(this.UserData);
  }

  getUser(ID: string) {
    this.usersListRef = this.db.list(`/users/${ID}`);
    return this.usersListRef;
  }

  modifierCarteId(UserData: User, carteId: string) {
    this.db.list(`/users/${carteId}`).remove();
    this.usersObjectRef = this.db.object(`/users/${UserData.carteId}`);
    this.usersObjectRef.set(UserData);
  }

  modifierPoste(carteId: string, poste: string) {
    this.db.object(`/users/${carteId}/poste`).set(poste);
  }
  modifierPrenom(carteId: string, prenom: string) {
    this.db.object(`/users/${carteId}/prenom`).set(prenom);
  }
  modifierNom(carteId: string, nom: string) {
    this.db.object(`/users/${carteId}/nom`).set(nom);
  }
  modifierAuthorised(carteId: string, authorised: boolean) {
    this.db.object(`/users/${carteId}/authorised`).set(authorised);
  }

  supprimerUser(carteId: string) {
    this.db.list(`/users/${carteId}`).remove();
  }

  addRespo(nom, email, password, etat, departement) {
    var user = {
      nom: nom,
      etat: etat,
      email: email,
      password: password,
      departement: departement,
      photoURL:
        'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg',
    };
    this.db.object(`/responsables/${departement}`).set(user);
  }

  getResponsiblesElectro() {
    let responsable: Responsable = {
      nom: '',
      etat: '',
      email: '',
      password: '',
      departement: '',
      photoURL: '',
    };
    this.db
      .list('/responsables')
      .query.orderByChild('departement')
      .equalTo('Electronique')
      .on('value', (snapshots) => {
        snapshots.forEach((snap) => {
          responsable.nom = snap.val().nom;
          responsable.etat = snap.val().etat;
          responsable.email = snap.val().email;
          responsable.password = snap.val().password;
          responsable.departement = snap.val().departement;
          responsable.photoURL = snap.val().photoURL;
        });
      });
    return responsable;
  }

  DesactiverRespoElectro() {
    let responsable: Responsable = this.getResponsiblesElectro();
    responsable.etat = 'inactif';
    this.db.object('/responsables/Electronique').set(responsable);
  }
  DesactiverRespoMeca() {
    let responsable: Responsable = this.getResponsiblesMeca();
    responsable.etat = 'inactif';
    this.db.object('responsables/Mécanique').set(responsable);
  }

  DesactiverRespoInfo() {
    let responsable: Responsable = this.getResponsiblesInfo();
    responsable.etat = 'inactif';
    this.db.object('responsables/Informatique').set(responsable);
  }

  activerRespoElectro() {
    let responsable: Responsable = this.getResponsiblesElectro();
    responsable.etat = 'actif';
    this.db.object('/responsables/Electronique').set(responsable);
  }
  activerRespoMeca() {
    let responsable: Responsable = this.getResponsiblesMeca();
    responsable.etat = 'actif';
    this.db.object('responsables/Mécanique').set(responsable);
  }

  activerRespoInfo() {
    let responsable: Responsable = this.getResponsiblesInfo();
    responsable.etat = 'actif';
    this.db.object('responsables/Informatique').set(responsable);
  }

  getResponsiblesMeca() {
    let responsable: Responsable = {
      nom: '',
      etat: '',
      email: '',
      password: '',
      departement: '',
      photoURL: '',
    };
    this.db
      .list('/responsables')
      .query.orderByChild('departement')
      .equalTo('Mécanique')
      .on('value', (snapshots) => {
        snapshots.forEach((snap) => {
          responsable.nom = snap.val().nom;
          responsable.etat = snap.val().etat;
          responsable.email = snap.val().email;
          responsable.password = snap.val().password;
          responsable.departement = snap.val().departement;
          responsable.photoURL = snap.val().photoURL;
        });
      });
    return responsable;
  }

  getResponsiblesInfo() {
    let responsable: Responsable = {
      nom: '',
      etat: '',
      email: '',
      password: '',
      departement: '',
      photoURL: '',
    };
    this.db
      .list('/responsables/')
      .query.orderByChild('departement')
      .equalTo('Informatique')
      .on('value', (snapshots) => {
        snapshots.forEach((snap) => {
          responsable.nom = snap.val().nom;
          responsable.etat = snap.val().etat;
          responsable.email = snap.val().email;
          responsable.password = snap.val().password;
          responsable.departement = snap.val().departement;
          responsable.photoURL = snap.val().photoURL;
        });
      });
    return responsable;
  }

  getDemandesConges() {
    let demandes = [];
    this.db
      .list('/conges')
      .query.orderByChild('etat')
      .equalTo('wait')
      .on('value', (values) => {
        values.forEach((snapshots) => {
          let conge = {
            carteId: '',
            debut: '',
            fin: '',
            nom: '',
            prenom: '',
            poste: '',
            departement: '',
          };
          conge.carteId = snapshots.val().carteId;
          conge.debut = snapshots.val().debut;
          conge.fin = snapshots.val().fin;

          this.db
            .list(`/users/`)
            .query.orderByKey()
            .equalTo(snapshots.val().carteId)
            .on('value', (snapshots) => {
              snapshots.forEach((snap) => {
                console.log(snap.val());
                conge.nom = snap.val().nom;
                conge.prenom = snap.val().prenom;
                conge.poste = snap.val().poste;
                conge.departement = snap.val().departement;
                demandes.push(conge);
              });
            });
        });
      });
    return demandes;
  }

  getDemandesCongesList() {
    let demandes = this.db.list('conges');
    return demandes;
  }
  accepterDemandeConges(carteId) {
    this.db
      .object(`/conges/${carteId}`)
      .valueChanges()
      .subscribe((values) => {
        let conge = {
          carteId: '',
          debut: '',
          fin: '',
          etat: '',
        };
        conge.carteId = values['carteId'];
        conge.debut = values['debut'];
        conge.fin = values['fin'];
        conge.etat = 'approuvée';
        this.db.object(`/conges/${carteId}/`).set(conge);
      });
  }

  refuserDemandeConges(carteId) {
    this.db
      .object(`/conges/${carteId}`)
      .valueChanges()
      .subscribe((values) => {
        let conge = {
          carteId: '',
          debut: '',
          fin: '',
          etat: '',
        };
        conge.carteId = values['carteId'];
        conge.debut = values['debut'];
        conge.fin = values['fin'];
        conge.etat = 'refusée';
        this.db.object(`/conges/${carteId}/`).set(conge);
      });
  }

  getUsersByDepartement(departement) {
    let users = [
      {
        nom: '',
        prenom: '',
      },
    ];

    this.db
      .list('users')
      .query.orderByChild('departement')
      .equalTo(departement)
      .on('value', (snapshots) => {
        snapshots.forEach((snap) => {
          console.log(snap.val().nom);
          snap.val().nom;
          snap.val().prenom;
          users.push({ nom: snap.val().nom, prenom: snap.val().prenom });
        });
      });

    return users;
  }
}

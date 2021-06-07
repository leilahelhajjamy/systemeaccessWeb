import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User, Responsable } from '../services/user.service';
import { FileUpload, FileUploadService } from '../services/file-upload.service';
import { ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  Users: User[];
  MecanicUsers: any[];
  ElectroUsers: any[];
  InfoUsers: any[];

  listUsersDom;
  ResponsablesElectro;
  ResponsablesInfo;
  ResponsablesMeca;
  authorised = true;
  carteId = '';
  formAddMecaRespo: FormGroup;
  nomMeca;
  prenomMeca;
  emailMeca;
  passwordMeca;
  nomInfo;
  prenomInfo;
  emailInfo;
  passwordInfo;
  nomElectro;
  prenomElectro;
  emailElectro;
  passwordElectro;
  mecaFile;
  electroFile;
  infoFile;
  AddInfoRespoClicked = false;
  AddMecaRespoClicked = false;
  AddElectroRespoClicked = false;
  formAddInfoRespo: FormGroup;
  formAddElectroRespo: FormGroup;
  private basePath = '/uploads';
  currentFileUpload: FileUpload;
  selectedFilesElectro: FileList;
  selectedFilesMeca: FileList;
  selectedFilesInfo: FileList;
  percentage: number;
  DemandesConge: any;
  searchText = '';
  constructor(
    public formBuilder: FormBuilder,
    private userService: UserService,
    private activityService: ActivityService,
    private router: Router,
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private uploadService: FileUploadService,
    private _snackBar: MatSnackBar
  ) {
    this.formAddMecaRespo = this.formBuilder.group({
      nom: new FormControl('', Validators.compose([Validators.required])),
      prenom: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([Validators.required])),
      password: new FormControl('', Validators.compose([Validators.required])),
    });
    this.formAddInfoRespo = this.formBuilder.group({
      nom: new FormControl('', Validators.compose([Validators.required])),
      prenom: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([Validators.required])),
      password: new FormControl('', Validators.compose([Validators.required])),
    });
    this.formAddElectroRespo = this.formBuilder.group({
      nom: new FormControl('', Validators.compose([Validators.required])),
      prenom: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([Validators.required])),
      password: new FormControl('', Validators.compose([Validators.required])),
    });
    this.listUsersDom = true;
  }

  ngOnInit(): void {
    this.ResponsablesElectro = this.userService.getResponsiblesElectro();
    console.log(this.ResponsablesElectro);
    this.ResponsablesMeca = this.userService.getResponsiblesMeca();
    console.log(this.ResponsablesMeca);
    this.ResponsablesInfo = this.userService.getResponsiblesInfo();
    console.log(this.ResponsablesInfo);
    this.fetchUsers();
    this.fetchDemandes();
    let usersRes = this.userService.getUsersList();
    usersRes.snapshotChanges().subscribe((res) => {
      this.Users = [];
      res.forEach((item) => {
        let a: any;
        a = item.payload.toJSON();
        a['$key'] = item.key;
        this.Users.push(a);
      });
    });
    this.getDemandesConges();
    console.log('demandes', this.DemandesConge);
  }

  openSnackBar() {
    this._snackBar.open('some thing goes here ', 'dance');
  }

  onChange(event: any) {
    this.filterList(event);
  }
  fetchUsers() {
    this.userService
      .getUsersList()
      .valueChanges()
      .subscribe((res) => {
        console.log(res);
      });
  }

  fetchDemandes() {
    this.userService
      .getDemandesCongesList()
      .valueChanges()
      .subscribe((res) => {
        console.log(res);
      });
  }
  adduserPage() {
    this.router.navigate(['adduser']);
  }

  async filterList(evt: any) {
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.Users = this.Users.filter((currentUser) => {
      if (currentUser.nom && searchTerm) {
        return (
          currentUser.nom.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        );
      } else {
        return currentUser.nom;
      }
    });
  }

  supprimerUser(carteId) {
    // add a model alert to confirm delete
    this.userService.supprimerUser(carteId);
  }

  async modifierAuthorised(carteId, authorised) {
    this.userService.modifierAuthorised(carteId, !authorised);
    // this.toastSuccess();
  }

  profileUser(carteId) {
    this.router.navigate(['/profiluser', carteId]);
  }

  hierarchie() {
    this.router.navigate(['/hierarchie']);
  }

  ajouterRespoMeca(nom, email, password) {
    this.userService.addRespo(nom, email, password, 'Mécanique');
    this.AddMecaRespoClicked = false;
  }
  ajouterRespoInfo(nom, email, password) {
    this.userService.addRespo(nom, email, password, 'Informatique');
    this.AddInfoRespoClicked = false;
  }
  ajouterRespoElectro(nom, email, password) {
    this.userService.addRespo(nom, email, password, 'Electronique');
    this.AddElectroRespoClicked = false;
  }
  addInfoRespoClicked() {
    this.AddInfoRespoClicked = true;
    this.InfoUsers = this.userService.getUsersByDepartement('Informatique');
  }
  addMecaRespoClicked() {
    this.AddMecaRespoClicked = true;
    this.MecanicUsers = this.userService.getUsersByDepartement('Mécanique');
  }
  addElectroRespoClicked() {
    this.AddElectroRespoClicked = true;
    this.ElectroUsers = this.userService.getUsersByDepartement('Electronique');
  }

  annuleraddInfoRespoClicked() {
    this.AddInfoRespoClicked = false;
  }
  annuleraddMecaRespoClicked() {
    this.AddMecaRespoClicked = false;
  }
  annuleraddElectroRespoClicked() {
    this.AddElectroRespoClicked = false;
  }
  selectFileElectro(event): void {
    this.selectedFilesElectro = event.target.files;
    this.uploadElectro();
  }
  uploadElectro(): void {
    const file = this.selectedFilesElectro.item(0);
    this.selectedFilesElectro = undefined;
    this.currentFileUpload = new FileUpload(file);
    console.log('departemeent electro', this.ResponsablesElectro.departement);
    this.uploadService
      .pushFileToStorageElectro(
        this.currentFileUpload,
        this.ResponsablesElectro
      )
      .subscribe(
        (percentage) => {
          this.percentage = Math.round(percentage);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  uploadMeca(): void {
    const file = this.selectedFilesMeca.item(0);
    this.selectedFilesMeca = undefined;
    console.log('departemeent meca', this.ResponsablesMeca.departement);
    this.currentFileUpload = new FileUpload(file);
    this.uploadService
      .pushFileToStorageMeca(this.currentFileUpload, this.ResponsablesMeca)
      .subscribe(
        (percentage) => {
          this.percentage = Math.round(percentage);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  uploadInfo(): void {
    const file = this.selectedFilesInfo.item(0);
    this.selectedFilesInfo = undefined;

    this.currentFileUpload = new FileUpload(file);
    this.uploadService
      .pushFileToStorageInfo(this.currentFileUpload, this.ResponsablesInfo)
      .subscribe(
        (percentage) => {
          this.percentage = Math.round(percentage);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  formAfficher() {
    this.listUsersDom = false;
  }
  listUsersDomChangedHandler(event) {
    this.listUsersDom = event;
  }

  selectFileMeca(eve) {
    this.selectedFilesMeca = eve.target.files;
    this.uploadMeca();
  }
  selectFileInfo(even) {
    this.selectedFilesInfo = even.target.files;
    this.uploadInfo();
  }

  getDemandesConges() {
    this.DemandesConge = this.userService.getDemandesConges();
  }

  accepter(carteId) {
    this.userService.accepterDemandeConges(carteId);
    this.ngOnInit();
    this.reloadComponent();
  }
  refuser(carteId) {
    this.userService.refuserDemandeConges(carteId);
    this.ngOnInit();
    this.reloadComponent();
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}

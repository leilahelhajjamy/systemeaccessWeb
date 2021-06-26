import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { User, UserService } from '../services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  listUsersDom;
  searchText;
  Users: User[];
  notifications: any;
  cards: any[];
  constructor(
    private userService: UserService,
    private router: Router,
    public toastService: ToastService
  ) {
    this.listUsersDom = true;
  }

  ngOnInit(): void {
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

    let cardsRes = this.userService.getCardsList();
    cardsRes.snapshotChanges().subscribe((res) => {
      this.cards = [];
      res.forEach((item) => {
        console.log('card', item.key);
        this.cards.push(item.key);
      });
    });
  }
  profileUser(carteId) {
    this.router.navigate(['/profiluser', carteId]);
  }
  supprimerUser(carteId) {
    // add a model alert to confirm delete
    this.userService.supprimerUser(carteId);
  }

  formAfficher() {
    this.listUsersDom = false;
  }
  listUsersDomChangedHandler(event) {
    this.listUsersDom = event;
  }
  async modifierAuthorised(carteId, authorised) {
    this.userService.modifierAuthorised(carteId, !authorised);
    // this.toastSuccess();
  }

  ajouterCarte() {
    this.listUsersDom = false;
  }
}

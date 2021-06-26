import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-conges',
  templateUrl: './conges.component.html',
  styleUrls: ['./conges.component.scss'],
})
export class CongesComponent implements OnInit {
  DemandesConge: any[];
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getDemandesConges();
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  adduserPage() {
    this.router.navigate(['usersList']);
  }

  congesPage() {
    this.router.navigate(['conges']);
  }

  logOut() {
    this.authService.signOut();
    this.router.navigate(['home']);
  }
}

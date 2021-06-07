import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  email: any;
  password: any;
  title = 'sysaccessWeb';
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.formLogin = new FormGroup({
      password: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  ngOnInit() {}

  login() {
    console.log(this.email, 'email passed');
    this.authService.login(this.email, this.password);
  }
  forgotPassword() {}
}

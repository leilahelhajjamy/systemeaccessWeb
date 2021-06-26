import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthGuardService } from './auth-guard.service';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private authGuard: AuthGuardService
  ) {}

  forgotPassword(passwordResetEmail: string) {
    return this.fireAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        console.log('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  signOut() {
    return this.fireAuth.signOut().then(() => {
      localStorage.removeItem('loggedIn');
      console.log('loggedOut');
      this.router.navigate(['']);
    });
  }

  async login(email: string, password: string) {
    this.fireAuth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user, 'logged in');
        localStorage.setItem('loggedIn', 'yes ');
        this.router.navigate(['users']);
        this.authGuard.canActivate();
      })
      .catch(async (error) => {
        console.log(error.code);
        console.log(error.message);
        // const alert = await this.alertController.create({
        //   cssClass: 'my-alert-class',
        //   message: error.message,
        //   buttons: [
        //     {
        //       cssClass: 'my-button-alert',
        //       text: 'Ok',
        //       handler: () => {
        //         console.log('ok clicked');
        //       },
        //     },
        //   ],
        // });
        // await alert.present();
      });
  }
}

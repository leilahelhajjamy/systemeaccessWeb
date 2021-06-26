import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { ProfiluserComponent } from './profiluser/profiluser.component';
import { AdduserComponent } from './adduser/adduser.component';
import { AuthGuardService } from './services/auth-guard.service';
import { StatisticsComponent } from './statistics/statistics.component';
import { ModalYearStatisticsComponent } from './modal-year-statistics/modal-year-statistics.component';
import { ModalMonthStatisticsComponent } from './modal-month-statistics/modal-month-statistics.component';
import { UsersListComponent } from './users-list/users-list.component';
import { CongesComponent } from './conges/conges.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'profiluser',
    component: ProfiluserComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'adduser',
    component: AdduserComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'profiluser/:carteId',
    component: ProfiluserComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'statistics/:carteId/:nom/:prenom',
    component: StatisticsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'statisticsModal/:carteId/:year',
    component: ModalYearStatisticsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'statisticsMonthModal/:carteId/:moi',
    component: ModalMonthStatisticsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'usersList',
    component: UsersListComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'conges',
    component: CongesComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

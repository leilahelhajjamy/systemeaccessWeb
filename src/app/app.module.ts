import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ProfiluserComponent } from './profiluser/profiluser.component';
import { AdduserComponent } from './adduser/adduser.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalYearStatisticsComponent } from './modal-year-statistics/modal-year-statistics.component';
import { ModalMonthStatisticsComponent } from './modal-month-statistics/modal-month-statistics.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FilterPipe } from './filter.pipe';
import { DayFilterPipe } from './day-filter.pipe';

const firebaseConfig = {
  apiKey: 'AIzaSyBgN5HXli1TiiCZney2RV25spifnhLbac0',
  authDomain: 'sysaccess-ecf6b.firebaseapp.com',
  databaseURL: 'https://sysaccess-ecf6b-default-rtdb.firebaseio.com',
  projectId: 'sysaccess-ecf6b',
  storageBucket: 'sysaccess-ecf6b.appspot.com',
  messagingSenderId: '879760335132',
  appId: '1:879760335132:web:22808658174a344135dad9',
  measurementId: 'G-982KE3TNTJ',
};

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    LoginComponent,
    ProfiluserComponent,
    AdduserComponent,
    StatisticsComponent,
    ModalYearStatisticsComponent,
    ModalMonthStatisticsComponent,
    NavbarComponent,
    FilterPipe,
    DayFilterPipe,
  ],
  imports: [
    MatSnackBarModule,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatGridListModule,
    MatButtonToggleModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule,
    BrowserAnimationsModule, // storage,
    ToastModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

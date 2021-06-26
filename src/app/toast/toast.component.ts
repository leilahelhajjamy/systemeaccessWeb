import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  notifications;
  constructor(
    public toastService: ToastService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.notifications = this.toastService.getessages();
    this.notifications.forEach((element) => {
      this.toast(`Une nouvelle carte a été ajouté ${element.carteId}`);
    });
  }

  dismiss(itemKey) {
    this.toastService.dissmissMessage(itemKey);
  }

  async toast(message) {
    this._snackBar.open(message, 'Cancel', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}

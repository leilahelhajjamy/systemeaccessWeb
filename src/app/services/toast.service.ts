import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  snapshotChanges,
} from '@angular/fire/database';

class Message {
  dismissed: '';
  carteId: '';
}
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(public db: AngularFireDatabase) {}

  getessages() {
    let messages: Message[] = [];
    let message: Message = {
      dismissed: '',
      carteId: '',
    };
    this.db
      .list('NewCard')
      .query.orderByChild('dismissed')
      .equalTo('false')
      .on('value', (snapshot) => {
        snapshot.forEach((snap) => {
          console.log('carte id new added', snap.val().carteId);
          message.dismissed = snap.val().dismissed;
          message.carteId = snap.val().carteId;
          messages.push(message);
        });
      });

    return messages;
  }

  dissmissMessage(messageKey) {
    this.db.object(`NewCard/${messageKey}`).update({ dismissed: 'true' });
  }
}

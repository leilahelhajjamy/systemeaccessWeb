import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Responsable } from './user.service';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
export class FileUpload {
  key: string;
  name: string;
  url: string;
  file: File;

  constructor(file: File) {
    this.file = file;
  }
}
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private basePath = '/uploads/electro';
  private basePathInfo = '/uploads/info';
  private basePathMeca = '/uploads/meca';

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

  pushFileToStorageElectro(
    fileUpload: FileUpload,
    User: Responsable
  ): Observable<number> {
    const filePath = `${this.basePath}/electro/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            fileUpload.url = downloadURL;
            fileUpload.name = fileUpload.file.name;
            User.photoURL = downloadURL;
            this.addRespo(User);
          });
        })
      )
      .subscribe();

    return uploadTask.percentageChanges();
  }

  pushFileToStorageMeca(
    fileUpload: FileUpload,
    User: Responsable
  ): Observable<number> {
    const filePath = `${this.basePathMeca}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            fileUpload.url = downloadURL;
            fileUpload.name = fileUpload.file.name;
            User.photoURL = downloadURL;
            this.addRespo(User);
          });
        })
      )
      .subscribe();

    return uploadTask.percentageChanges();
  }

  pushFileToStorageInfo(
    fileUpload: FileUpload,
    User: Responsable
  ): Observable<number> {
    const filePath = `${this.basePathInfo}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            fileUpload.url = downloadURL;
            fileUpload.name = fileUpload.file.name;
            User.photoURL = downloadURL;
            this.addRespo(User);
          });
        })
      )
      .subscribe();

    return uploadTask.percentageChanges();
  }
  addRespo(user: Responsable) {
    var user: Responsable = {
      etat: user.etat,
      nom: user.nom,
      email: user.email,
      password: user.password,
      departement: user.departement,
      photoURL: user.photoURL,
    };
    console.log('changing in departement', user.departement);
    this.db.object(`/responsables/${user.departement}`).set(user);
  }
  getFiles(numberItems): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, (ref) => ref.limitToLast(numberItems));
  }

  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch((error) => console.log(error));
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
}

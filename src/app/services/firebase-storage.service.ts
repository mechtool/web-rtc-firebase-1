import { Injectable } from '@angular/core';
let firebase = require('firebase/app');
require("firebase/storage");
@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

    public storage ;
  constructor() {
      this.storage = firebase.storage();
  }
}

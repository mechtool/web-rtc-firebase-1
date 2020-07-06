import { Injectable } from '@angular/core';
let firebase = require('firebase/app');
require('firebase/database');
@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {

    public database;
  constructor() {
      this.database = firebase.database();
  }
}

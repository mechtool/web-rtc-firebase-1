import { Injectable } from '@angular/core';
let firebase = require('firebase/app');
require("firebase/messaging");

@Injectable({
  providedIn: 'root'
})
export class FirebaseMessagingService {
  public messaging;
  constructor() {
      this.messaging = firebase.messaging();
  }
}

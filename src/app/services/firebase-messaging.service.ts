import { Injectable } from '@angular/core';
import {FirebaseDatabaseService} from "./firebase-database.service";
import {Select, Store} from "@ngxs/store";
import {AppContextState} from "../store/states";
import {Observable} from "rxjs";
let firebase = require('firebase/app');
require("firebase/messaging");

@Injectable({
  providedIn: 'root'
})
export class FirebaseMessagingService {
    
    public messaging;
    //Для генерации Baerer смотрим : https://stackoverflow.com/questions/50399170/what-bearer-token-should-i-be-using-for-firebase-cloud-messaging-testing
    private messagingData : {publicKey : string, bearer : string} =  require('../../assets/js/messaging.json');
    
    constructor(
        public store : Store,
        public firebaseDatabase : FirebaseDatabaseService)
    {
      this.messaging = firebase.messaging();
      this.messaging.usePublicVapidKey(this.messagingData.publicKey);
  }
  
  getToken(){
      let appUser = this.store.selectSnapshot(AppContextState.appUser);
      this.messaging.getToken().then((currentToken) => {
          if (currentToken) {
		this.firebaseDatabase.database.ref(`/users/${appUser.uid}`).update({messToken : currentToken});
	  }
      }).catch((err) => {
	  	  console.log('An error occurred while retrieving token. ', err);
      });
  }
  
  initialize(){
      this.messaging.onMessage((payload) => {
	  console.log('Message received. ', payload);
      });
      this.messaging.onTokenRefresh(() => {
	  console.log('Token refreshed.');
	this.getToken();
      });
  }
    
    sendNotification(offer){
    
    }
}

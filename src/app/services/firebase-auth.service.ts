import { Injectable } from '@angular/core';
import {Store} from "@ngxs/store";
import {Actions} from "../store/actions";
import {Contact} from "../classes/Classes";
import AppUserAction = Actions.AppUserAction;
import * as fb from "firebase";
import { FirebaseDatabaseService } from './firebase-database.service';
import { async } from 'rxjs/internal/scheduler/async';
import AppUserChangedAction = Actions.AppUserChangedAction;
let firebase = require('firebase/app');
require("firebase/auth");

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

    public firebase;
    public auth : fb.auth.Auth;
  
    constructor(
      public firebaseDatabase : FirebaseDatabaseService,
        public store : Store) {
            this.firebase = firebase;
            this.auth = firebase.auth();
            this.initialize();
  }
  
  initialize(){
      this.auth.onAuthStateChanged((user : any)=> {
	        user === undefined || this.setUser(user);
      });
  }
  
  setUser(user){
    if(user === null) this.store.dispatch( new AppUserAction(user));
    else {
      //Проверить наличие пользователя в базе данных : если пользователя не существует, то создать его
      let val, ref = this.firebaseDatabase.database.ref(`/users/${user.uid}`);
      ref.once('value', (snap)=>{
        val = snap.val(); 
        if(val) {
            //Подписка на изменение данных пользователя : для отображения его текущего состояния
	    this.firebaseDatabase.database.ref(`/users/${user.uid}`).on('child_changed', snap =>{
		let val = snap.val;
		val && this.store.dispatch( new AppUserChangedAction(val));
	    })
            this.store.dispatch( new AppUserAction(val));
	    this.store.dispatch( new AppUserChangedAction(val));
	}
        else ref.set(new Contact(user)); 
      }) ;
    }
  }

  singOut(){
        this.auth.signOut();
  }
  
}

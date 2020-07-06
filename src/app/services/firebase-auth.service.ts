import { Injectable } from '@angular/core';
import {Store} from "@ngxs/store";
import {Actions} from "../store/actions";
import {Contact} from "../classes/Classes";
import AppUserAction = Actions.AppUserAction;
import * as fb from "firebase";
let firebase = require('firebase/app');
require("firebase/auth");

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

    public firebase;
    public auth : fb.auth.Auth;
  
    constructor(
        public store : Store) {
	this.firebase = firebase;
	this.auth = firebase.auth();
	this.initialize();
  }
  
  initialize(){
      this.auth.onAuthStateChanged((user : any)=> {
	 this.store.dispatch( new AppUserAction(user == null ? user : new Contact(user)));
      });
  }
}

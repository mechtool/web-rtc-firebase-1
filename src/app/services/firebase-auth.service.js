var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { Actions } from "../store/actions";
import { Contact } from "../classes/Classes";
var AppUserAction = Actions.AppUserAction;
let firebase = require('firebase/app');
require("firebase/auth");
let FirebaseAuthService = class FirebaseAuthService {
    constructor(store) {
        this.store = store;
        this.firebase = firebase;
        this.auth = firebase.auth();
        this.initialize();
    }
    initialize() {
        this.auth.onAuthStateChanged((user) => {
            this.store.dispatch(new AppUserAction(user == null ? user : new Contact(user)));
        });
    }
};
FirebaseAuthService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], FirebaseAuthService);
export { FirebaseAuthService };

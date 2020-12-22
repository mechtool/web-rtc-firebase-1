var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { Actions } from "../store/actions";
var ContactsLimitAction = Actions.ContactsLimitAction;
var UpdateTypeAction = Actions.UpdateTypeAction;
var ExcludeAddedAction = Actions.ExcludeAddedAction;
let SettingsDefaultService = class SettingsDefaultService {
    constructor(store) {
        this.store = store;
        this.initialize();
    }
    initialize() {
        return Promise.all([
            this.store.dispatch(new ContactsLimitAction(window.localStorage.getItem('contactsLimit') || '1')).toPromise(),
            this.store.dispatch(new ExcludeAddedAction(window.localStorage.getItem('excludeAdded') || '0')).toPromise(),
            this.store.dispatch(new UpdateTypeAction(window.localStorage.getItem('updateType') || '0')).toPromise(),
        ]).then();
    }
};
SettingsDefaultService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], SettingsDefaultService);
export { SettingsDefaultService };

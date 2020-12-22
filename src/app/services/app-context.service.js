var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { Select } from "@ngxs/store";
import { Actions } from "../store/actions";
var AppUserAction = Actions.AppUserAction;
import { AppContextState } from "../store/states";
let AppContextService = class AppContextService {
    constructor(store, http) {
        this.store = store;
        this.http = http;
    }
    initialize() {
        return new Promise((res, rej) => {
            res();
        });
    }
    filterAppUser(coll) {
        let user = this.store.selectSnapshot(AppContextState.appUser);
        return coll.filter(cont => {
            return cont._id !== user.uid;
        });
    }
    getState(outlet) {
        return outlet.activatedRouteData.type;
    }
    clearRecaptcha() {
        if (this.recaptchaVerifier && this.recaptchaVerifier.clear) {
            this.recaptchaVerifier.clear();
            this.recaptchaVerifier = undefined;
        }
    }
};
__decorate([
    Select(AppUserAction)
], AppContextService.prototype, "appUser$", void 0);
AppContextService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AppContextService);
export { AppContextService };

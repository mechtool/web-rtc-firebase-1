var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { Actions } from "../store/actions";
var OnLineAction = Actions.OnLineAction;
let OnlineService = class OnlineService {
    constructor(store) {
        this.store = store;
        this.initialize();
    }
    initialize() {
        return new Promise((res, rej) => {
            window.addEventListener('online', this.checkOnLine.bind(this));
            window.addEventListener('offline', this.checkOnLine.bind(this));
            this.checkOnLine();
            res();
        });
    }
    checkOnLine() {
        this.store.dispatch(new OnLineAction(navigator.onLine));
    }
};
OnlineService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], OnlineService);
export { OnlineService };

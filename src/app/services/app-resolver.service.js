var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { Actions } from "../store/actions";
var StunTurnConfigAction = Actions.StunTurnConfigAction;
var ApiKeysAction = Actions.ApiKeysAction;
let AppResolverService = class AppResolverService {
    constructor(http, store) {
        this.http = http;
        this.store = store;
    }
    resolve() {
        return Promise.all([
            //Запрос файлов конфигураций
            this.http.get('/assets/js/apiKeys.json').toPromise().then(res => {
                this.store.dispatch(new ApiKeysAction(res));
                return res;
            }),
            //Запрс конфигурации turn сервера
            this.http.get('/assets/js/stunTurnConfig.json').toPromise().then(res => {
                this.store.dispatch(new StunTurnConfigAction(res));
                return res;
            }),
        ]).catch(err => console.log(err));
    }
};
AppResolverService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AppResolverService);
export { AppResolverService };

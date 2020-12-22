var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { Actions } from "../store/actions";
var BeforeInstallAction = Actions.BeforeInstallAction;
let ScreenInstallService = class ScreenInstallService {
    constructor(store) {
        this.store = store;
    }
    initialize() {
        return new Promise((res, rej) => {
            //Обработка события установки приложения на экран устройства
            window.addEventListener("beforeinstallprompt", (beforeInstallPromptEvent) => {
                //Управление переходит в этот обработчик, если приложение еще не установлено на экран (каждый раз)
                //и не переходит, когда приложение уже установлено
                beforeInstallPromptEvent.preventDefault(); // Предотвратить немедленный запуск отображения диалога
                this.store.dispatch(new BeforeInstallAction(beforeInstallPromptEvent));
            });
            //прослушивание события 'appinstall' для определения установки приложения на экран устройства
            window.addEventListener("appinstalled", (evt) => {
                //Управление переходит в этот обработчик сразу (next tick) после принятия
                //предложения об установки приложения один раз и больще никогда не переходит.
                //приложение уже установлено на экран устройства
                this.store.dispatch(new BeforeInstallAction(true));
            });
            res();
        });
    }
};
ScreenInstallService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ScreenInstallService);
export { ScreenInstallService };

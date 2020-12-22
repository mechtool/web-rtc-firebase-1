var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
let SplashComponent = class SplashComponent {
    constructor() {
        this.buttonBlocks = [
            { className: 'button-contacts', icon: 'start-contacts', badge: false, fragment: '0', area: 'Контакты' },
            { className: 'button-announcements', icon: 'start-announcements', badge: '1', hiddenBadge: false, fragment: '1', area: 'Уведомления' },
            { className: 'button-messages', icon: 'start-messages', badge: false, fragment: '2', area: 'Сообщения' },
            { className: 'button-settings', icon: 'start-settings', badge: false, fragment: '5', area: 'Настройки' },
        ];
    }
    ngOnInit() {
    }
};
SplashComponent = __decorate([
    Component({
        selector: 'app-splash',
        templateUrl: './splash.component.html',
        styleUrls: ['./splash.component.css']
    })
], SplashComponent);
export { SplashComponent };

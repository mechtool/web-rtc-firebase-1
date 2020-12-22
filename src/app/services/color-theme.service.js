var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ColorThemeService_1;
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions } from "../store/actions";
var ColorThemeAction = Actions.ColorThemeAction;
let ColorThemeService = ColorThemeService_1 = class ColorThemeService {
    constructor(overlay, store, platformId) {
        this.overlay = overlay;
        this.store = store;
        this.platformId = platformId;
        this.initialize();
    }
    get colorItems() {
        return ColorThemeService_1.colorBase;
    }
    get logoItems() {
        return ColorThemeService_1.logoItems;
    }
    initialize() {
        //Установка значения цвета при старте приложения
        window.localStorage.getItem('appColorClass') || window.localStorage.setItem('appColorClass', 'second-theme');
        return this.store.dispatch(new ColorThemeAction(window.localStorage.getItem('appColorClass'))).toPromise();
    }
    setAppTheme(selector) {
        this.overlay.getContainerElement().classList.add(selector);
        window.localStorage.setItem('appColorClass', selector);
        this.store.dispatch(new ColorThemeAction(selector));
        return selector;
    }
    getThemeColor(type) {
        //Получения цвета приложения по имени свойства объекта цвета: backgroundColor , color , light
        let colorClass = this.store.selectSnapshot(state => state.appContext.appColorClass);
        return this.colorItems.filter(color => color.colorClass === colorClass)[0][type];
    }
    getNeededColor(index) {
        return 0 === index % 2 ? this.getThemeColor('even') : this.getThemeColor('odd');
    }
};
ColorThemeService.logoItems = {
    'first-theme': { c0: '#fdea81', c1: '#fdd736', c2: 'rgb(245,195,0)', c3: '#fff', c4: '#fff', c5: '#fff' },
    'second-theme': { c0: '#a0d7f1', c1: 'rgb(97, 179, 234)', c2: '#2196f3', c3: '#fff', c4: '#fff', c5: '#fff' },
    'third-theme': { c0: '#ffbca1', c1: 'rgb(255, 133, 92)', c2: '#ff5722', c3: '#fff', c4: '#fff', c5: '#fff' },
    'forth-theme': { c0: '#a2b0ea', c1: '#7682e5', c2: '#3f51b5', c3: '#fff', c4: '#fff', c5: '#fff' },
};
ColorThemeService.colorBase = [
    { colorClass: 'first-theme', backgroundColor: '#fdd835', color: '#e9b13b', light: 'rgba(255,234,65,0.71)', active: false, iconColor: '#000', even: 'rgba(255,238,88,0.15)', odd: 'rgba(255,238,88,0.19)', highlight: 'rgba(255,238,88,0.36)' },
    { colorClass: 'second-theme', backgroundColor: '#2196f3', color: '#1083cd', light: 'rgba(66,165,245,0.51)', active: true, iconColor: '#fff', even: 'rgba(66,165,245,0.07)', odd: 'rgba(66,165,245,0.12)', highlight: 'rgba(66,165,245,0.26)' },
    { colorClass: 'third-theme', backgroundColor: '#ff5722', color: '#c13316', light: 'rgba(255,114,69,0.51)', active: false, iconColor: '#fff', even: 'rgba(255,112,67,0.05)', odd: 'rgba(255,112,67,0.11)', highlight: 'rgba(255,112,67,0.25)' },
    { colorClass: 'forth-theme', backgroundColor: '#3f51b5', color: 'rgba(39,23,135,0.92)', light: 'rgba(92,107,192,0.51)', active: false, iconColor: '#fff', even: 'rgba(92,107,192,0.07)', odd: 'rgba(92,107,192,0.11)', highlight: 'rgba(92,107,192,0.26)' },
];
ColorThemeService.iconColors = [
    { color: '#2e64d6', active: false }, { color: '#c14523', active: false },
    { color: '#49a680', active: false }, { color: '#d6a211', active: false },
    { color: '#bf5389', active: false }, { color: '#2e9630', active: false },
];
ColorThemeService = ColorThemeService_1 = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __param(2, Inject(PLATFORM_ID))
], ColorThemeService);
export { ColorThemeService };

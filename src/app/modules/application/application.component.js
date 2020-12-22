var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Component } from '@angular/core';
import { fadeAnimation } from "../../animations/animations";
let ApplicationComponent = class ApplicationComponent {
    constructor(appContextService, defaultSettingsService, permissionsService, screenInstallService) {
        this.appContextService = appContextService;
        this.defaultSettingsService = defaultSettingsService;
        this.permissionsService = permissionsService;
        this.screenInstallService = screenInstallService;
    }
    ngOnInit() {
        this.initializeServices();
    }
    initializeServices() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.defaultSettingsService.initialize();
            yield this.screenInstallService.initialize();
            yield this.appContextService.initialize();
            //todo Убрать заглушку на продакшн
            if (window.location.href.indexOf('localhost') === -1)
                yield this.permissionsService.checkPermissions();
        });
    }
};
ApplicationComponent = __decorate([
    Component({
        selector: 'app-application',
        templateUrl: './application.component.html',
        styleUrls: ['./application.component.css'],
        animations: [fadeAnimation]
    })
], ApplicationComponent);
export { ApplicationComponent };

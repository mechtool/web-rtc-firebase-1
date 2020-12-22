var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MaterialModule } from "./modules/material/material.module";
import { GeneralModule } from "./modules/general/general.module";
import { NgxsModule } from "@ngxs/store";
import { AppContextState, LocalStorageState } from "./store/states";
import { HttpClientModule } from "@angular/common/http";
import { AppContextService } from "./services/app-context.service";
import { AppResolverService } from "./services/app-resolver.service";
import { ColorThemeService } from "./services/color-theme.service";
import { OnlineService } from "./services/online.service";
import { SettingsDefaultService } from "./services/settings-default.service";
import { AppErrorHandler } from "./services/error-handle.service";
import { PermissionsService } from "./services/permissions.service";
import { ScreenInstallService } from "./services/screen-install.service";
import { StatusColorsService } from "./services/status-colors.service";
import { FirebaseService } from "./services/firebase.service";
import { FirebaseAuthService } from "./services/firebase-auth.service";
import { FirebaseDatabaseService } from "./services/firebase-database.service";
import { FirebaseStorageService } from "./services/firebase-storage.service";
import { FirebaseMessagingService } from "./services/firebase-messaging.service";
let AppModule = class AppModule {
};
AppModule = __decorate([
    NgModule({
        declarations: [
            AppComponent,
        ],
        imports: [
            BrowserModule,
            AppRoutingModule,
            HttpClientModule,
            BrowserAnimationsModule,
            NgxsModule.forRoot([LocalStorageState, AppContextState], { developmentMode: !environment.production }),
            ServiceWorkerModule.register('service-worker.js', { enabled: true, registrationStrategy: 'registerImmediately', scope: './' }),
            MaterialModule,
            GeneralModule,
        ],
        providers: [
            { provide: ErrorHandler, useClass: AppErrorHandler },
            AppContextService,
            AppResolverService,
            ColorThemeService,
            OnlineService,
            SettingsDefaultService,
            PermissionsService,
            ScreenInstallService,
            StatusColorsService,
            FirebaseService,
            FirebaseAuthService,
            FirebaseDatabaseService,
            FirebaseStorageService,
            FirebaseMessagingService,
        ],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };

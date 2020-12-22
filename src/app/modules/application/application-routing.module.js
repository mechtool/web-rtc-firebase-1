var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationComponent } from "./application.component";
import { SplashComponent } from "./splash/splash.component";
import { PermissionsComponent } from "./permissions/permissions.component";
import { OnlineComponent } from "./online/online.component";
const routes = [
    { path: '', component: ApplicationComponent, children: [
            { path: 'splash', component: SplashComponent, data: { type: 'splash' } },
            { path: 'permissions', component: PermissionsComponent, data: { type: 'permissions' } },
            { path: 'online', component: OnlineComponent, data: { type: 'online' } },
            { path: '', pathMatch: 'full', redirectTo: 'splash' },
        ] }
];
let ApplicationRoutingModule = class ApplicationRoutingModule {
};
ApplicationRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    })
], ApplicationRoutingModule);
export { ApplicationRoutingModule };

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppResolverService } from "./services/app-resolver.service";
const routes = [
    { path: 'application', resolve: { serverData: AppResolverService }, loadChildren: () => import('./modules/application/application.module').then(m => m.ApplicationModule), data: { type: 'application' } },
    { path: 'authorization', loadChildren: () => import('./modules/authorization/authorization.module').then(m => m.AuthorizationModule), data: { type: 'authorization' } },
    { path: '', pathMatch: 'full', redirectTo: 'authorization' },
    { path: '**', pathMatch: 'full', redirectTo: 'authorization' },
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes, {
                initialNavigation: 'enabled'
            })],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };

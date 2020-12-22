var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StartComponent } from "./start/start.component";
const routes = [
    { path: 'start', component: StartComponent, data: { type: 'start' } },
    { path: 'enter', loadChildren: () => import('./enter/enter.module').then(m => m.EnterModule), data: { type: 'enter' } },
    { path: '', pathMatch: 'full', redirectTo: 'start' },
];
let AuthorizationRoutingModule = class AuthorizationRoutingModule {
};
AuthorizationRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    })
], AuthorizationRoutingModule);
export { AuthorizationRoutingModule };

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationRoutingModule } from './authorization-routing.module';
import { MaterialModule } from "../material/material.module";
import { GeneralModule } from "../general/general.module";
import { StartComponent } from "./start/start.component";
let AuthorizationModule = class AuthorizationModule {
};
AuthorizationModule = __decorate([
    NgModule({
        declarations: [StartComponent],
        imports: [
            CommonModule,
            MaterialModule,
            GeneralModule,
            AuthorizationRoutingModule
        ]
    })
], AuthorizationModule);
export { AuthorizationModule };

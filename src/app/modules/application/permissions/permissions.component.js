var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { Select } from "@ngxs/store";
import { AppContextState } from "../../../store/states";
import { notificationAppearance } from "../../../animations/animations";
let PermissionsComponent = class PermissionsComponent {
    constructor() {
        this.subscribes = [];
    }
    ngOnInit() {
        this.subscribes.push(this.permissions$.subscribe(permiss => {
        }));
    }
    ngOnDestroy() {
        this.subscribes.forEach(sub => sub.unsubscribe());
    }
};
__decorate([
    Select(AppContextState.permissions)
], PermissionsComponent.prototype, "permissions$", void 0);
PermissionsComponent = __decorate([
    Component({
        selector: 'app-permissions',
        templateUrl: './permissions.component.html',
        styleUrls: ['./permissions.component.css'],
        animations: [
            notificationAppearance
        ],
    })
], PermissionsComponent);
export { PermissionsComponent };

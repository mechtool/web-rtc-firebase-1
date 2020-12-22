var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { slideAnimation } from "../../../animations/animations";
let EnterComponent = class EnterComponent {
    constructor(appContext, router) {
        this.appContext = appContext;
        this.router = router;
        this.tabs = [
            { label: 'Phone', link: '/authorization/enter/phone' },
            { label: 'Email', link: '/authorization/enter/email' },
            { label: 'Anonymously', link: '/authorization/enter/anonymously' },
        ];
    }
    ngOnInit() {
    }
    onSelectedTab(event) {
        this.router.navigateByUrl(this.tabs[event.index].link);
    }
};
EnterComponent = __decorate([
    Component({
        selector: 'app-enter',
        templateUrl: './enter.component.html',
        styleUrls: ['./enter.component.css'],
        animations: [slideAnimation]
    })
], EnterComponent);
export { EnterComponent };

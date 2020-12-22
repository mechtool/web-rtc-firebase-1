var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnterComponent } from "./enter.component";
import { PhoneComponent } from "./phone/phone.component";
import { EmailComponent } from "./email/email.component";
import { AnonymouslyComponent } from "./anonymously/anonymously.component";
import { SmsComponent } from "./sms/sms.component";
import { HelpComponent } from "./help/help.component";
const routes = [
    { path: '', component: EnterComponent, children: [
            { path: 'phone', component: PhoneComponent, data: { type: "phone" } },
            { path: 'help', component: HelpComponent, data: { type: "help" } },
            { path: 'email', component: EmailComponent, data: { type: "email" } },
            { path: 'sms', component: SmsComponent, data: { type: "sms" } },
            { path: 'anonymously', component: AnonymouslyComponent, data: { type: "anonymously" } },
            { path: '', pathMatch: 'full', redirectTo: 'phone' },
        ] }
];
// @ts-ignore
// @ts-ignore
let EnterRoutingModule = class EnterRoutingModule {
};
EnterRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    })
], EnterRoutingModule);
export { EnterRoutingModule };

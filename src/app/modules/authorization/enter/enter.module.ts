import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterRoutingModule } from './enter-routing.module';
import {MaterialModule} from "../../material/material.module";
import {GeneralModule} from "../../general/general.module";
import {PhoneComponent} from "./phone/phone.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EnterComponent} from "./enter.component";
import { AnonymouslyComponent } from './anonymously/anonymously.component';
import { EmailComponent } from './email/email.component';
import { HelpComponent } from './help/help.component';
import {SmsComponent} from "./sms/sms.component";


@NgModule({
    declarations: [
	PhoneComponent,
	EnterComponent,
	AnonymouslyComponent,
	EmailComponent,
	HelpComponent,
	SmsComponent,
    ],
    exports: [
	PhoneComponent
    ],
    imports: [
	CommonModule,
	FormsModule,
	ReactiveFormsModule,
	MaterialModule,
	GeneralModule,
	EnterRoutingModule
    ]
})
export class EnterModule { }

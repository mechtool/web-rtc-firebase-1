import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EnterComponent} from "./enter.component";
import {PhoneComponent} from "./phone/phone.component";
import {EmailComponent} from "./email/email.component";
import {AnonymouslyComponent} from "./anonymously/anonymously.component";
import {SmsComponent} from "./sms/sms.component";
import {HelpComponent} from "./help/help.component";


const routes: Routes = [
    {path : '', component : EnterComponent, children : [
	    {path : 'phone',  component : PhoneComponent, data : {type : "phone"}},
	    {path : 'help',  component : HelpComponent, data : {type : "help"}},
	    {path : 'email',  component : EmailComponent, data : {type : "email"}},
	    {path : 'sms',  component : SmsComponent, data : {type : "sms"}},
	    {path : 'anonymously',  component : AnonymouslyComponent,  data : {type : "anonymously"}},
	    {path : '', pathMatch : 'full', redirectTo : 'phone'},
	]}
];

// @ts-ignore
// @ts-ignore
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnterRoutingModule { }

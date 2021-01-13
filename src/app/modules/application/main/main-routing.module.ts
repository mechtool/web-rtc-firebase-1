import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from "./main.component";


const routes: Routes = [
    {path : '', component : MainComponent, children : [
	    {path : 'contacts',  loadChildren : ()=> import('./contacts/contacts.module').then(m => m.ContactsModule), data : {type : 'contacts'}} ,
	    {path : 'settings',  loadChildren : ()=> import('./settings/settings.module').then(m => m.SettingsModule), data : {type : 'settings'}} ,
	    {path : 'contact-detail',  loadChildren : ()=> import('./contact-detail/contact-detail.module').then(m => m.ContactDetailModule), data : {type : 'contact-detail'}} ,
	    {path : 'announcements',  loadChildren : ()=> import('./announcements/announcements.module').then(m => m.AnnouncementsModule), data : {type : 'announcements'}} ,
	    {path : 'messages',  loadChildren : ()=> import('./messages/messages.module').then(m => m.MessagesModule), data : {type : 'messages'}} ,
	    {path : 'sms-setting', loadChildren : ()=> import('./settings/sms-setting/sms-setting.module').then(m => m.SmsSettingModule), data : {type : 'sms-setting'}},
		{path : 'sms-rates', loadChildren : ()=> import('./settings/sms-rates/sms-rates.module').then(m => m.SmsRatesModule), data : {type : 'sms-rates'}},
		{path : 'new-message',  loadChildren : ()=> import('./new-message/new-message.module').then(m => m.NewMessageModule), data : {type : 'new-message'}} ,
	    {path : '', pathMatch : 'full', redirectTo : 'contacts'},
	]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

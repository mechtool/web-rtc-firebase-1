import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ApplicationComponent} from "./application.component";
import {SplashComponent} from "./splash/splash.component";
import {PermissionsComponent} from "./permissions/permissions.component";
import {OnlineComponent} from "./online/online.component";
import {HardwareComponent} from "./hardware/hardware.component";


const routes: Routes = [
    {path : '', component : ApplicationComponent,  children : [
	    {path : 'splash' , component : SplashComponent, data : {type : 'splash'}},
	    {path : 'permissions', component : PermissionsComponent, data : {type : 'permissions'}} ,
	    {path : 'online' , component : OnlineComponent, data : {type : 'online'}},
	    {path : 'hardware' , component : HardwareComponent, data : {type : 'hardware'}},
	    {path : 'video-message',  loadChildren : ()=> import('./video-message/video-message.module').then(m => m.VideoMessageModule), data : {type : 'video-message'}},
	    {path : 'text-message',  loadChildren : ()=> import('./text-message/text-message.module').then(m => m.TextMessageModule), data : {type : 'text-message'}},
	    {path : 'main', loadChildren : ()=> import('./main/main.module').then(m => m.MainModule), data : {type : 'main'}},
	    {path : '', pathMatch : 'full', redirectTo : 'splash'},
	]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }

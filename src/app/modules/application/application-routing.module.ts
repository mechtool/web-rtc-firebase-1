import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ApplicationComponent} from "./application.component";
import {SplashComponent} from "./splash/splash.component";
import {PermissionsComponent} from "./permissions/permissions.component";
import {OnlineComponent} from "./online/online.component";


const routes: Routes = [
    {path : '', component : ApplicationComponent,  children : [
	    {path : 'splash' , component : SplashComponent, data : {type : 'splash'}},
	    {path : 'permissions', component : PermissionsComponent, data : {type : 'permissions'}} ,
	    {path : 'online' , component : OnlineComponent, data : {type : 'online'}},
	    {path : '', pathMatch : 'full', redirectTo : 'splash'},
	]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }

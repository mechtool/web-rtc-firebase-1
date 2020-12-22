import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsComponent} from "./settings.component";
import {GeneralComponent} from "./general/general.component";
import {AdvancedComponent} from "./advanced/advanced.component";


const routes: Routes = [
    {path : '', component : SettingsComponent, children : [
	    {path : 'general', component : GeneralComponent, data : {type : 'general'}},
	    {path : 'advanced', component : AdvancedComponent, data : {type : 'advanced'}},
	    {path : '', pathMatch : 'full', redirectTo : 'general'}
	]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }

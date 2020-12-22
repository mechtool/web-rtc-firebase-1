import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StartComponent} from "./start/start.component";

const routes: Routes = [
    {path : 'start' ,  component : StartComponent , data : {type : 'start'}},
    {path : 'enter',  loadChildren : ()=> import('./enter/enter.module').then(m => m.EnterModule), data : {type : 'enter'}},
    {path : '', pathMatch : 'full', redirectTo : 'start'},
    {path : '**', pathMatch : 'full', redirectTo : 'start'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorizationRoutingModule { }

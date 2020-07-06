import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppResolverService} from "./services/app-resolver.service";
const routes: Routes =  [
    {path : 'application', resolve: {serverData : AppResolverService}, loadChildren : ()=> import('./modules/application/application.module').then(m => m.ApplicationModule), data : {type : 'application'}},
    {path : 'authorization', loadChildren : ()=> import('./modules/authorization/authorization.module').then(m => m.AuthorizationModule), data : {type : 'authorization'}},
    {path : '', pathMatch :'full', redirectTo : 'authorization'} ,
    {path : '**', pathMatch :'full', redirectTo : 'authorization'} ,
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
      initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SmsSettingComponent} from "./sms-setting.component";


const routes: Routes = [
    {path : '', component : SmsSettingComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsSettingRoutingModule { }

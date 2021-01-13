import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SmsRatesComponent} from "./sms-rates.component";


const routes: Routes = [
    {path : '', component : SmsRatesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsRatesRoutingModule { }

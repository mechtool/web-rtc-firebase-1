import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsRatesRoutingModule } from './sms-rates-routing.module';
import {MaterialModule} from "../../../../material/material.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
      MaterialModule,
    SmsRatesRoutingModule
  ]
})
export class SmsRatesModule { }

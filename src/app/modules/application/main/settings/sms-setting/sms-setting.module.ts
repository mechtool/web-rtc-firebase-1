import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsSettingRoutingModule } from './sms-setting-routing.module';
import {MaterialModule} from "../../../../material/material.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
      MaterialModule,
    SmsSettingRoutingModule
  ]
})
export class SmsSettingModule { }

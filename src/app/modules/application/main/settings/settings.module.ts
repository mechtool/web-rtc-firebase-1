import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import {MaterialModule} from "../../../material/material.module";
import { GeneralComponent } from './general/general.component';
import { AdvancedComponent } from './advanced/advanced.component';
import {RouterModule} from "@angular/router";
import {GeneralModule} from "../../../general/general.module";
import { SmsSettingComponent } from './sms-setting/sms-setting.component';


@NgModule({
  declarations: [
      SettingsComponent,
      GeneralComponent,
      AdvancedComponent,
      SmsSettingComponent
  ],
  imports: [
    CommonModule,
      RouterModule,
      GeneralModule,
    SettingsRoutingModule ,
      MaterialModule,
      ReactiveFormsModule,
      FormlyModule,
      FormlyMaterialModule,
  ]
})
export class SettingsModule { }

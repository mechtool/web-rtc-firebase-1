import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import {ApplicationComponent} from "./application.component";
import {OnlineComponent} from "./online/online.component";
import {PermissionsComponent} from "./permissions/permissions.component";
import {SplashComponent} from "./splash/splash.component";
import {MaterialModule} from "../material/material.module";
import { HardwareComponent } from './hardware/hardware.component';
import {GeneralModule} from "../general/general.module";


@NgModule({
  declarations: [
      ApplicationComponent,
      OnlineComponent,
      PermissionsComponent,
      SplashComponent,
      HardwareComponent
  ],
  imports: [
    CommonModule,
      MaterialModule,
    ApplicationRoutingModule,
      GeneralModule,
  ]
})
export class ApplicationModule { }

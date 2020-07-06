import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorizationRoutingModule } from './authorization-routing.module';
import {MaterialModule} from "../material/material.module";
import {GeneralModule} from "../general/general.module";
import {StartComponent} from "./start/start.component";


@NgModule({
  declarations: [StartComponent],
  imports: [
    CommonModule,
      MaterialModule,
      GeneralModule,
    AuthorizationRoutingModule
  ]
})
export class AuthorizationModule { }

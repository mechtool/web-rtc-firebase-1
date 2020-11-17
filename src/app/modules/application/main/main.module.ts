import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import {MainComponent} from "./main.component";
import {MaterialModule} from "../../material/material.module";
import {RouterModule} from "@angular/router";
import {GeneralModule} from "../../general/general.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
      MainComponent,
  ],
    imports: [
	CommonModule,
	MainRoutingModule,
	MaterialModule,
	RouterModule,
	GeneralModule,
	ReactiveFormsModule,
    ]
})
export class MainModule { }

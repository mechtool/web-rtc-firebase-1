import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactDetailRoutingModule } from './contact-detail-routing.module';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {MaterialModule} from "../../../material/material.module";
import { GeneralModule } from 'src/app/modules/general/general.module';
import { ContactDetailComponent } from './contact-detail.component';


@NgModule({
  declarations: [ContactDetailComponent],
  imports: [
    CommonModule,
    ContactDetailRoutingModule,
    FormsModule,
      ReactiveFormsModule,
      GeneralModule,
      MaterialModule,
  ]
})
export class ContactDetailModule { }

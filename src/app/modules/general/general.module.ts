import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ColorThemeComponent} from "./color-theme/color-theme.component";
import {MaterialModule} from "../material/material.module";

@NgModule({
  declarations: [ColorThemeComponent],
    exports : [
        ColorThemeComponent,
    ],
  imports: [
    CommonModule,
      MaterialModule,
  ]
})
export class GeneralModule { }

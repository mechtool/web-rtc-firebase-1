import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ColorThemeComponent} from "./color-theme/color-theme.component";
import {MaterialModule} from "../material/material.module";
import {LogoImageComponent} from "./logo-image/logo-image.component";

@NgModule({
  declarations: [
      ColorThemeComponent,
      LogoImageComponent,
  ],
    exports : [
        ColorThemeComponent,
	LogoImageComponent,
    ],
  imports: [
    CommonModule,
      MaterialModule,
  ]
})
export class GeneralModule { }

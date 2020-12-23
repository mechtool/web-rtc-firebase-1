import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {MatTabsModule} from "@angular/material/tabs";
import {MatBadgeModule} from "@angular/material/badge";
import {MatMenuModule} from "@angular/material/menu";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSliderModule} from "@angular/material/slider";
import {MatRippleModule} from "@angular/material/core";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatExpansionModule} from "@angular/material/expansion";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
      MatToolbarModule,
      MatIconModule,
      MatCardModule,
      MatFormFieldModule,
      MatSelectModule,
      MatTooltipModule,
      MatButtonModule,
      MatInputModule,
      MatProgressBarModule,
      MatProgressSpinnerModule,
      MatRadioModule,
      MatTabsModule,
      MatBadgeModule,
      MatMenuModule,
      MatAutocompleteModule,
      MatButtonToggleModule,
      MatSlideToggleModule,
      MatSliderModule,
      MatRippleModule,
      MatSnackBarModule,
      MatExpansionModule,
      
  ],
    exports :[
	MatToolbarModule,
	MatIconModule,
	MatCardModule,
	MatFormFieldModule,
	MatSelectModule,
	MatTooltipModule,
	MatButtonModule,
	MatInputModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatTabsModule,
	MatBadgeModule,
	MatMenuModule,
	MatAutocompleteModule,
	MatButtonToggleModule,
	MatSlideToggleModule,
	MatSliderModule,
	MatRippleModule ,
	MatSnackBarModule,
	MatExpansionModule
    ]
})
export class MaterialModule { }

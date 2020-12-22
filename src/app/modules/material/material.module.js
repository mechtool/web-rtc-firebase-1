var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";
import { MatBadgeModule } from "@angular/material/badge";
import { MatMenuModule } from "@angular/material/menu";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatRippleModule } from "@angular/material/core";
let MaterialModule = class MaterialModule {
};
MaterialModule = __decorate([
    NgModule({
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
        ],
        exports: [
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
        ]
    })
], MaterialModule);
export { MaterialModule };

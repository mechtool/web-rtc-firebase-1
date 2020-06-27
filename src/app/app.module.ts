import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {MaterialModule} from "./modules/material/material.module";
import {GeneralModule} from "./modules/general/general.module";
import {NgxsModule} from "@ngxs/store";
import {AppContextState, LocalStorageState} from "./store/states";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
      HttpClientModule,
    BrowserAnimationsModule,
      NgxsModule.forRoot([LocalStorageState, AppContextState], {developmentMode: !environment.production}),
      ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
      MaterialModule,
      GeneralModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

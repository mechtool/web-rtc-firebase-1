import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ColorThemeComponent} from "./color-theme/color-theme.component";
import {MaterialModule} from "../material/material.module";
import {LogoImageComponent} from "./logo-image/logo-image.component";
import {LogoTemplateComponent} from "./logo-template/logo-template.component";
import { ContactComponent } from './contact/contact.component';
import { ContactSearchComponent } from './contact-search/contact-search.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ContactItemComponent} from "./contact-item/contact-item.component";
import { SettingItemComponent } from './setting-item/setting-item.component';
import {SettingsDividerComponent} from "./settings-divider/settings-divider.component";
import{ContactIconSelectComponent} from './contact-icon-select/contact-icon-select.component'
import { RouterModule } from '@angular/router';
import { PhoneControlComponent } from './phone-control/phone-control.component';
import {PopupNotificationsComponent} from "./popup-notifications/popup-notifications.component";
import {IncomingCallPopupComponent} from "./popup-notifications/incoming-call-popup/incoming-call-popup.component";
import {NoAnswerPopupComponent} from "./popup-notifications/no-answer-popup/no-answer-popup.component";
import {UpdatePopupComponent} from "./popup-notifications/update-popup/update-popup.component";

@NgModule({
  declarations: [
      ColorThemeComponent,
      LogoImageComponent,
      LogoTemplateComponent,
      ContactComponent,
      ContactSearchComponent,
      ContactItemComponent,
      SettingItemComponent,
      SettingsDividerComponent,
      ContactIconSelectComponent,
      PhoneControlComponent,
      PopupNotificationsComponent,
      IncomingCallPopupComponent,
      NoAnswerPopupComponent,
      UpdatePopupComponent,
  ],
    exports : [
        ColorThemeComponent,
	LogoImageComponent,
	LogoTemplateComponent,
	ContactComponent,
	ContactSearchComponent,
	ContactItemComponent,
	SettingItemComponent,
  SettingsDividerComponent,
  ContactIconSelectComponent,
	PhoneControlComponent,
	PopupNotificationsComponent,
	IncomingCallPopupComponent,
	NoAnswerPopupComponent,
	UpdatePopupComponent,
    ],
    imports: [
	CommonModule,
	FormsModule,
	RouterModule,
	ReactiveFormsModule,
	MaterialModule,
    ]
})
export class GeneralModule { }

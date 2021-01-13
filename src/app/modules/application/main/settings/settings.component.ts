import {Component, OnDestroy, OnInit} from '@angular/core';
import {fadeAnimation} from "../../../../animations/animations";
import {AppContextService} from "../../../../services/app-context.service";
import { Router} from "@angular/router";
import { LocalizationService } from 'src/app/services/localization.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
    animations : [fadeAnimation]
})
export class SettingsComponent implements OnInit, OnDestroy {
    
    public settingsHeader = `${this.localizationService.getText(80)} ${this.localizationService.getText(73).toLowerCase()}`;
    public subscriptions = [];
    public buttons = [
        {icon : 'start-settings', tip: this.localizationService.getText(80), link : '/application/main/settings/general'},
        {icon : 'settings2', tip: this.localizationService.getText(81), link : '/application/main/settings/advanced'},
        ];
  constructor(
      public router : Router,
      public localizationService : LocalizationService,
      public appContext : AppContextService
  ) {

  }

  ngOnInit(): void {
  }
    outletActivate($event){
          let url = this.router.url;
          this.settingsHeader = `${this.localizationService.getText(url.indexOf('general') >= 0 ? 80 : url.indexOf('advanced') >= 0 ? 81 :  80)}  ${this.localizationService.getText(73).toLowerCase()}`;
    }

  ngOnDestroy() {
      this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
}

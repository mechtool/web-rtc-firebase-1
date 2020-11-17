import { Component, OnInit } from '@angular/core';
import {LocalizationService} from "../../../services/localization.service";

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {
    public buttonBlocks = [
	{className : 'button-contacts', icon : 'start-contacts',  badge : false, link : '/application/main/contacts', area : this.localizationService.getText(70)} ,
	{className : 'button-announcements', icon : 'start-announcements', badge : '1' , hiddenBadge : false,  link : '/application/main/announcements', area : this.localizationService.getText(71)},
	{className : 'button-messages', icon : 'start-messages', badge : false,  link : '/application/main/messages', area : this.localizationService.getText(72)} ,
	{className : 'button-settings', icon : 'start-settings',  badge : false, link : '/application/main/settings', area : this.localizationService.getText(73)} ,
    ];
  constructor(
      public localizationService: LocalizationService) {
  }
  
  
  ngOnInit(): void {
  }

}

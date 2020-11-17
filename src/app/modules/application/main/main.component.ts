import { ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AppContextService} from "../../../services/app-context.service";
import { Router} from "@angular/router";
import {fadeAnimation} from "../../../animations/animations";
import {BreakpointObserver,  BreakpointState} from "@angular/cdk/layout";
import { LocalizationService } from 'src/app/services/localization.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
    animations : [fadeAnimation] ,
})
export class MainComponent implements OnInit, OnDestroy{
    
    public media = false;
    public subscriptions = [];
    public buttons = [
	{label : this.localizationService.getText(70), icon : 'start-contacts',  link : '/application/main/contacts'},
	{label : this.localizationService.getText(71), icon : 'start-announcements',  link : '/application/main/announcements', badge : ''},
    {label : this.localizationService.getText(72), icon : 'start-messages', link : '/application/main/messages'},
    {label : this.localizationService.getText(74), icon : 'start-phone', link : '/application/main/new-message'},
    {label : this.localizationService.getText(73), icon : 'start-settings',  link : '/application/main/settings'},
    ];
    
    constructor(
        public localizationService : LocalizationService,
        public changeRef : ChangeDetectorRef,
        public breakpointObserver : BreakpointObserver,
	  public appContext : AppContextService,
	  public router : Router) {}
  
    ngOnInit(): void {
	this.subscriptions.push(this.breakpointObserver.observe('(max-width: 449.99px)').subscribe((state: BreakpointState) => {
	        this.media = state.matches;
	        this.changeRef.detectChanges();
	    }));
  }
  
    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
}

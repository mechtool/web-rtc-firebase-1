import {Component, Inject, OnInit} from '@angular/core';
import {ColorThemeService} from "../../../../../services/color-theme.service";
import {Store} from "@ngxs/store";
import {Actions} from "../../../../../store/actions";
import ContactsLimitAction = Actions.ContactsLimitAction;
import ExcludeAddedAction = Actions.ExcludeAddedAction;
import {AppContextState, LocalStorageState} from "../../../../../store/states";
import LanguageAction = Actions.LanguageAction;
import ContactModeAction = Actions.ContactModeAction;
import VideoHardwareAction = Actions.VideoHardwareAction;
import AudioHardwareAction = Actions.VideoHardwareAction;
import {FirebaseAuthService} from "../../../../../services/firebase-auth.service";
import { LocalizationService } from 'src/app/services/localization.service';
import {AppContextService} from "../../../../../services/app-context.service";
import {Router} from "@angular/router";
import UpdateTypeAction = Actions.UpdateTypeAction;
import {SwUpdateService} from "../../../../../services/sw-update.service";

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
    
    public settings = [
	{type : 'divider', text : this.localizationService.getText(82)},
	{type : 'user', className : 'app-user'},
	{type : 'button', className : 'exitButton', text : this.localizationService.getText(83), svg : 'exit', disabled: false, listener : ()=>{
	       this.firebaseAuth.singOut();
	    }},
	{type : 'select', text : this.localizationService.getText(84), label : '', disabled : false, value : this.store.selectSnapshot(LocalStorageState.language),
	    listener : (value)=>{
		this.store.dispatch(new LanguageAction(value));
		//Перезагрузка приложения для вступление в силу изменений
		this.router.navigate(['/application','main', 'settings', 'general']);
	    },
	    select : { options : [{text : 'Ru', disabled : false}, {text : 'En', disabled : false},]}},
	{type : 'divider', text : 'SMS'},
	{type : 'button', className : 'sms-button', text : this.localizationService.getText(121), svg : 'sms', disabled: false, listener : ()=>{
		this.router.navigateByUrl('/application/main/sms-rates');
	    }},
	{type : 'divider', text : this.localizationService.getText(70)},
	{type : 'toggle', text : this.localizationService.getText(85), value :  JSON.parse(this.store.selectSnapshot(LocalStorageState.excludeAdded)),  disabled : false, listener : (value)=>{
		this.store.dispatch(new ExcludeAddedAction(JSON.stringify(value.checked)))}},
	{type : 'select', text : this.localizationService.getText(86), label : '', disabled : false, value : this.store.selectSnapshot(LocalStorageState.contactsLimit),
	    listener : (value)=>{
    this.store.dispatch(new ContactsLimitAction(value))},
	    select : { options : [{text : '1', disabled : false}, {text : 'Auto', disabled : false},]}},
	{type : 'select', text : this.localizationService.getText(87), label : '', disabled : false, value : this.store.selectSnapshot(LocalStorageState.contactMode),
	    listener : (value)=>{
		this.store.dispatch(new ContactModeAction(value));
		//Перезагрузка приложения для вступления в силу изменений
		this.router.navigate(['/application','main', 'settings', 'general']);
	    },
	    select : { options : [{text : 'icon', disabled : false}, {text : 'text', disabled : false},]}},
	{type : 'divider', text : this.localizationService.getText(88)},
	{type : 'select', text : this.localizationService.getText(89), label : '', disabled : false, value : this.store.selectSnapshot(LocalStorageState.videoHardware),
	    listener : (value)=>{
		this.store.dispatch(new VideoHardwareAction(value))},
	    select : { options : this.store.selectSnapshot(AppContextState.hardware).filter(h => {
			return h.kind === 'videoinput';
		}).map(h => {
		    return {text : h.text, disable : false};
		})}},
		{type : 'select', text : this.localizationService.getText(90), label : '', disabled : false, value : this.store.selectSnapshot(LocalStorageState.audioHardware),
	    listener : (value)=>{
		this.store.dispatch(new AudioHardwareAction(value))},
	    select : { options : this.store.selectSnapshot(AppContextState.hardware).filter(h => {
			return h.kind === 'audioinput';
		}).map(h => {
		    return {text : h.text, disable : false};
	    })}},
	{type : 'divider', text : this.localizationService.getText(111)},
	{type : 'button', className : 'updateButton', text : this.localizationService.getText(108), svg : 'update', disabled: false, listener : ()=>{
		this.swUpdateService.checkForUpdate();
	    }},
	{type : 'select', text : this.localizationService.getText(109), label : '', disabled : false, value : this.appContext.updateType[parseInt(this.store.selectSnapshot(LocalStorageState.updateType))].text,
	    listener : (value)=>{
		this.store.dispatch(new UpdateTypeAction(JSON.stringify(this.appContext.updateType.findIndex(type => type.text === value))));
	    },
	    select : { options : [{text : this.localizationService.getText(110) , disabled : false}, {text : this.localizationService.getText(112), disabled : false},{text : this.localizationService.getText(113), disabled : false}]}},
	{type : 'divider', text : this.localizationService.getText(114)},
	{type : 'colorTheme', text: this.localizationService.getText(91)},
    ];
    constructor(
	public store : Store,
	public router : Router,
	public appContext : AppContextService,
	public firebaseAuth : FirebaseAuthService,
	public colorService : ColorThemeService,
	public swUpdateService : SwUpdateService,
	public localizationService : LocalizationService
    ) {
    }
    ngOnInit(): void {
  }


}

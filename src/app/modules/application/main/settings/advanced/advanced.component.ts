import {Component, OnInit} from '@angular/core';
import { LocalStorageState} from "../../../../../store/states";
import {ColorThemeService} from "../../../../../services/color-theme.service";
import {Store} from "@ngxs/store";
import {Actions} from "../../../../../store/actions";
import StunTurnAction = Actions.StunTurnAction;
import OptimizeCallAction = Actions.OptimizeCallAction;
import CallSaveAction = Actions.CallSaveAction;
import CallTimeAction = Actions.CallTimeAction;
import CallModeAction = Actions.CallModeAction;
import DuplicateCallAction = Actions.DuplicateCallAction;
import {LocalizationService} from "../../../../../services/localization.service";

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.css']
})
export class AdvancedComponent  {
    
    public settings = [
	{type : 'divider', text : 'Web RTC'},
	{type : 'toggle', text : this.localizationService.getText(116), label : '', disabled : false, value : JSON.parse(this.store.selectSnapshot(LocalStorageState.optimizeCall)),
	    listener : (value)=>{
		this.store.dispatch(new OptimizeCallAction(JSON.stringify(value.checked)))},
	},
	{type : 'toggle', text : this.localizationService.getText(117), label : '', disabled : false, value : JSON.parse(this.store.selectSnapshot(LocalStorageState.callSave)),
	    listener : (value)=>{
		this.store.dispatch(new CallSaveAction(JSON.stringify(value.checked)))},
	},
	{type : 'toggle', text : this.localizationService.getText(118), label : '', disabled : false, value : JSON.parse(this.store.selectSnapshot(LocalStorageState.duplicateCall)),
	    listener : (value)=>{
		this.store.dispatch(new DuplicateCallAction(JSON.stringify(value.checked)))},
	},
	{type : 'select', text : 'Stun/Turn', label : '', disabled : false, value : this.store.selectSnapshot(LocalStorageState.stunTurn),
	    listener : (value)=>{
		this.store.dispatch(new StunTurnAction(value))},
	    select : { options : [{text : 'Default', disabled : false}, {text : 'Host', disabled : false}, {text : 'Xirsys', disabled : false}]}},
	{type : 'select', text : this.localizationService.getText(119), label : '', disabled : false, value : this.store.selectSnapshot(LocalStorageState.callTime),
	    listener : (value)=>{
		this.store.dispatch(new CallTimeAction(value))},
	    select : { options : [{text : '20000', disabled : false}, {text : '30000', disabled : false}, {text : '40000', disabled : false}]}},
	{type : 'select', text :  this.localizationService.getText(120), label : '', disabled : false, value : this.store.selectSnapshot(LocalStorageState.callMode),
	    listener : (value)=>{
		this.store.dispatch(new CallModeAction(value))},
	    select : { options : [{text : 'push', disabled : false}, {text : 'sms', disabled : false}]}},
 ];
    constructor(
        public store : Store,
        public colorService : ColorThemeService,
	public localizationService : LocalizationService) {
    }

}

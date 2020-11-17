import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {Actions} from "../store/actions";
import ContactsLimitAction = Actions.ContactsLimitAction;
import UpdateTypeAction = Actions.UpdateTypeAction;
import ExcludeAddedAction = Actions.ExcludeAddedAction;
import LanguageAction = Actions.LanguageAction;
import ContactModeAction = Actions.ContactModeAction;
import {AppContextState} from "../store/states";
import {Observable} from "rxjs";
import VideoHardwareAction = Actions.VideoHardwareAction;
import AudioHardwareAction = Actions.AudioHardwareAction;
import {LOCAL_STORAGE, NAVIGATOR} from "../classes/Globals";
import StunTurnAction = Actions.StunTurnAction;
import OptimizeCallAction = Actions.OptimizeCallAction;
import CallSaveAction = Actions.CallSaveAction;
import CallTimeAction = Actions.CallTimeAction;
import CallModeAction = Actions.CallModeAction;
import DuplicateCallAction = Actions.DuplicateCallAction;

@Injectable({
  providedIn: 'root'
})
export class SettingsDefaultService implements OnDestroy{

    public subscriptions = [];
    @Select(AppContextState.hardware) public hardware$ : Observable<any> ;
    
    constructor(
	@Inject(NAVIGATOR) public navigator : Navigator,
        @Inject(LOCAL_STORAGE) public localStorage : Storage ,
	public store : Store) {
      this.initialize();
  }
  
  ngOnDestroy() {
        this.subscriptions.forEach(sub=> sub.unsubscribe());
  }
    
    initialize(){
        this.subscriptions.push(this.hardware$.subscribe(hardware => {
             if(hardware && hardware.length){
		 this.store.dispatch(new VideoHardwareAction( this.localStorage.getItem('videoHardware') || hardware.find(div => div.kind === 'videoinput').text));
		 this.store.dispatch(new AudioHardwareAction( this.localStorage.getItem('audioHardware') || hardware.find(div => div.kind === 'audioinput').text));
	     }
	})) ;
      return Promise.all(
	  [
	      this.store.dispatch(new ContactsLimitAction( this.localStorage.getItem('contactsLimit') || '1')).toPromise(),
	      this.store.dispatch(new ExcludeAddedAction( this.localStorage.getItem('excludeAdded') || 'false')).toPromise(),
	      this.store.dispatch(new OptimizeCallAction( this.localStorage.getItem('optimizeCall') || 'false')).toPromise(),
	      this.store.dispatch(new DuplicateCallAction( this.localStorage.getItem('duplicateCall') || 'false')).toPromise(),
	      this.store.dispatch(new UpdateTypeAction( this.localStorage.getItem('updateType') || '2')).toPromise(),
	      this.store.dispatch(new CallModeAction( this.localStorage.getItem('callMode') || 'push')).toPromise(),
	      this.store.dispatch(new CallSaveAction( this.localStorage.getItem('callSave') || 'false')).toPromise(),
	      this.store.dispatch(new CallTimeAction( this.localStorage.getItem('callTime') || '30000')).toPromise(),
	      this.store.dispatch(new StunTurnAction( this.localStorage.getItem('stunTurn') || 'Default')).toPromise(),
	      this.store.dispatch(new UpdateTypeAction( this.localStorage.getItem('updateType') || '0')).toPromise(),
	      this.store.dispatch(new LanguageAction( this.localStorage.getItem('language') || (this.navigator.language.indexOf('ru') > -1 ? 'Ru' : 'En'))).toPromise(),
	      //Режим отображения иконок контактов
	      this.store.dispatch(new ContactModeAction( this.localStorage.getItem('contactMode') || 'icon')).toPromise(),
	  ],
      );
  }
}

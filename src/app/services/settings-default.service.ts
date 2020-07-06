import { Injectable } from '@angular/core';
import {Store} from "@ngxs/store";
import {Actions} from "../store/actions";
import ContactsLimitAction = Actions.ContactsLimitAction;
import UpdateTypeAction = Actions.UpdateTypeAction;
import ExcludeAddedAction = Actions.ExcludeAddedAction;

@Injectable({
  providedIn: 'root'
})
export class SettingsDefaultService {

  constructor(public store : Store) {
      this.initialize();
  }
  
  initialize(){
      return Promise.all(
	  [
	      this.store.dispatch(new ContactsLimitAction( window.localStorage.getItem('contactsLimit') || '1')).toPromise(),
	      this.store.dispatch(new ExcludeAddedAction( window.localStorage.getItem('excludeAdded') || '0')).toPromise(),
	      this.store.dispatch(new UpdateTypeAction( window.localStorage.getItem('updateType') || '0')).toPromise(),
	  
	  ]
      ).then()
	  
  }
}

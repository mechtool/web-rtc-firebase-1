import {Component, Input, OnDestroy} from '@angular/core';
import {Observable} from "rxjs";
import {Contact} from "../../../classes/Classes";
import {FormControl, Validators} from "@angular/forms";
import {ColorThemeService} from "../../../services/color-theme.service";
import { map} from "rxjs/operators";
import {Store} from "@ngxs/store";
import {FirebaseDatabaseService} from "../../../services/firebase-database.service";
import {AppContextState, LocalStorageState} from "../../../store/states";
import {Actions} from "../../../store/actions";
import ActivatedContactsAction = Actions.ActivatedContactsAction;
import {LocalizationService} from "../../../services/localization.service";

@Component({
  selector: 'app-contact-search',
  templateUrl: './contact-search.component.html',
  styleUrls: ['./contact-search.component.css']
})
export class ContactSearchComponent implements OnDestroy {

    
    public subscriptions = [];
    public optionCollection : Observable<Contact[]> = new Observable<Contact[]>()  ;
    public searchControl = new FormControl('', [Validators.required]);
    public appUser = this.store.selectSnapshot(AppContextState.appUser);
    @Input() public context : {type : number; mode : string, baseCollection : Observable<Contact[]>, targetCollection : Observable<Contact[]>};
    
    constructor(
        public store : Store,
        public localizationService : LocalizationService,
        public firebaseDatabaseService : FirebaseDatabaseService,
        public colorThemeService : ColorThemeService) { }


  ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
  }
    
    optionSelected(contact : Contact){
        if(!this.inCollection(contact)){
	    if( this.context.mode === 'users'){
		this.firebaseDatabaseService.database.ref(`/contacts/${this.appUser.uid}/${contact.uid}`).set(contact) ;
	    }else if(this.context.mode === 'contacts'){
		let activated = this.store.selectSnapshot(AppContextState.activatedContacts);
		activated.push(contact);
		this.store.dispatch(new ActivatedContactsAction(activated))  ;
	    }
	}
    }
    
    onChangeType(type){
        this.context.type = type;
    }
    
    inCollection(context){
        let collection;
        switch (this.context.mode) {
	    case 'users' : collection = this.store.selectSnapshot(AppContextState.contacts);
	        break;
	    case 'contacts' : collection = this.store.selectSnapshot(AppContextState.activatedContacts);
	        break;
	}
	return collection.some(c => c.uid === context.uid);
    }
    onKeyup() {
		let that = this,
			excludeAdded = JSON.parse(this.store.selectSnapshot(LocalStorageState.excludeAdded)),
			query = that.searchControl.value.trim(), reg = new RegExp(`^${query}`,'i');
		if(query){
			this.subscriptions.push(this.context.targetCollection.subscribe(target =>{
				this.optionCollection = this.context.baseCollection.pipe(map(collection =>{
					return collection.filter(contact => {
						if(excludeAdded && target.some(cont => cont.uid === contact.uid)){
								return false;
							}
							return contact.uid !== this.appUser.uid && (reg.test(contact.displayName) || reg.test(contact.userName) || reg.test(contact.secondName)|| reg.test(contact.thirdName) || reg.test(contact.email) || reg.test(contact.phoneNumber));
						})
					}))
			}));
		}
    }

}

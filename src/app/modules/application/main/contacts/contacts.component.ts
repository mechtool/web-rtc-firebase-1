import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {AppContextState} from "../../../../store/states";
import {Observable} from "rxjs";
import {Contact} from "../../../../classes/Classes";
import {contactSearch} from "../../../../animations/animations";
import {Actions} from "../../../../store/actions";
import {ColorThemeService} from "../../../../services/color-theme.service";
import ActivatedContactsAction = Actions.ActivatedContactsAction;
import { Router} from "@angular/router";
import { LocalizationService } from 'src/app/services/localization.service';
import { FirebaseDatabaseService } from 'src/app/services/firebase-database.service';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.css'],
    animations : [contactSearch],
})
export class ContactsComponent implements OnDestroy {
    
    @Select(AppContextState.contacts) public contacts$ : Observable<Contact[]> ;
    @Select(AppContextState.users) public usersCollection$ : Observable<Contact[]> ;
    @Select(AppContextState.activatedContacts) public activatedContacts$ : Observable<Contact[]> ;
    

    public user = this.store.selectSnapshot(AppContextState.appUser);
    public subscriptions = [];
    public contactSearch = 'false';  //down
    public buttons : {icon : string, tip : string, listener? : Function, disabled : boolean}[] = [];
    public contactSearchContext = {type : +this.user.isAnonymous, mode : 'users', baseCollection : this.usersCollection$, targetCollection : this.contacts$}
    
    constructor(
		public firebaseDatabase : FirebaseDatabaseService,
		public localizationService : LocalizationService,
		public colorService : ColorThemeService,
		public router : Router,
		public changeRef : ChangeDetectorRef,
		public colorThemeService : ColorThemeService,
		public store : Store) {
	//При открытии страницы отчистить коллекцию активированных контактов
	this.store.dispatch(new ActivatedContactsAction([]));
	this.buttons = [
	    {icon : 'detailed', tip: this.localizationService.getText(77), listener : this.detailContact.bind(this), disabled : true},
		{icon : 'delete', tip : this.localizationService.getText(79), listener : this.deleteContact.bind(this), disabled : true},
		{icon : 'plus', tip: this.localizationService.getText(78), disabled : false, listener : this.searchContact.bind(this)}
	
	];
    }
    
    ngOnDestroy(): void {
	//При закрытии страницы - отчистить коллекцию пользователей
	this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    detailContact(){
	this.router.navigate(['application', 'main', 'contact-detail'], {
	    state : {from : 'contacts'}
	}) ;
    }
    
    checkButtons(){
	let activatedContacts = this.store.selectSnapshot(AppContextState.activatedContacts);
	this.buttons[0].disabled = activatedContacts.length !== 1 ;
	this.buttons[1].disabled = activatedContacts.length === 0 ;
	this.changeRef.markForCheck();
    }
    
    onSelectedItem(item){
	let activatedContacts = this.store.selectSnapshot(AppContextState.activatedContacts),
	    contacts = this.store.selectSnapshot(AppContextState.contacts);
	for(let i = 0; i < activatedContacts.length; i++){
	    let el = activatedContacts[i];
	    if(el.uid == item.context.uid){
		activatedContacts.splice(i, 1);
		item.current.style.backgroundColor  =  this.colorThemeService.getNeededColor(contacts.findIndex(c => c.uid === item.context.uid));
		this.store.dispatch(new ActivatedContactsAction(activatedContacts)).toPromise().then(()=> this.checkButtons());
		return;
	    }
	}
	activatedContacts.push(item.context);
	item.current.style.backgroundColor = this.colorThemeService.getThemeColor('light');
	this.store.dispatch(new ActivatedContactsAction(activatedContacts)).toPromise().then(() => this.checkButtons())
    }
    
    searchContact(){
	this.contactSearch = this.contactSearch === 'false' ? 'true' : 'false';
    }
    
    deleteContact(){
		this.store.selectSnapshot(AppContextState.activatedContacts).forEach(cont => 
		    this.firebaseDatabase.database.ref(`/contacts/${this.user.uid}/${cont.uid}`).remove()
		);
		this.store.dispatch(new ActivatedContactsAction([])).toPromise().then(() => this.checkButtons());
    }
    
}

import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {LocalizationService} from "../../../services/localization.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NAVIGATOR} from "../../../classes/Globals";
import {BehaviorSubject, Observable} from "rxjs";
import {Contact} from "../../../classes/Classes";
import {map} from "rxjs/operators";
import {Select, Store} from "@ngxs/store";
import {AppContextState, LocalStorageState} from "../../../store/states";
import {STATES} from "../../../classes/Classes";
import {Actions} from "../../../store/actions";
import ContactsAction = Actions.ContactsAction;
import ActivatedContactsAction = Actions.ActivatedContactsAction;
import {FirebaseDatabaseService} from "../../../services/firebase-database.service";

@Component({
  selector: 'app-phone-control',
  templateUrl: './phone-control.component.html',
  styleUrls: ['./phone-control.component.css']
})
export class PhoneControlComponent implements OnInit, OnDestroy {
    
    public subscriptions =[] ;
    public states = STATES;
    public selected = this.states.find((el) => {
	return this.navigator.language.indexOf(el.class) >= 0;
    });
    public phoneGroup = new FormGroup({
	codeControl: new FormControl(this.selected, [Validators.required]),
	phoneControl: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
    });
    public optionCollection$ : Observable<Contact[]>= new BehaviorSubject<Contact[]>([]);
    public appUser = this.store.selectSnapshot(AppContextState.appUser);
    public buttonSearchDisabled = this.appUser.isAnonymous;
    @Output() public changeType = new EventEmitter();
    @Input() private mode : string;
    @Select(AppContextState.users) public usersCollection$ : Observable<Contact[]> ;
    @Select(AppContextState.contacts) public contacts$ : Observable<Contact[]> ;
    
    constructor(
	@Inject(NAVIGATOR) public navigator : Navigator,
        public store : Store,
        public localizationService : LocalizationService,
	public firebaseDatabaseService: FirebaseDatabaseService) { }

  ngOnInit(): void {
  }
   ngOnDestroy() {
       this.subscriptions.forEach(sub => sub.unsubscribe());
   }
    onKeyDown($event){
       return /\d/.test($event.key) || $event.key === 'Backspace';
    }
    onKeyup(){
        let queryPhone = this.phoneGroup.get('phoneControl').value;
        if(queryPhone){
	    let regPhone = new RegExp(`^${queryPhone}`,'i'),
		excludeAdded = JSON.parse(this.store.selectSnapshot(LocalStorageState.excludeAdded));
		this.optionCollection$ = (this.mode === 'users' ? this.usersCollection$ : this.contacts$).pipe(map(collection =>{
		    return collection.filter(contact => {
			if(excludeAdded  && this.getCollection(this.mode).some(cont => cont.uid === contact.uid)){
			    return false;
			}
			return (contact.uid !== this.appUser.uid && contact.phoneCode.indexOf(this.selected.code) === 0 && regPhone.test(contact.phoneNumber));
		    })
		}))
	}
    }
    optionSelected(contact){
	let contacts = this.getCollection(this.mode);
	if(contacts.some(c => c.uid === contact.uid)) return false;
	if(this.mode === 'users'){
	    this.firebaseDatabaseService.database.ref(`/contacts/${this.appUser.uid}/${contact.uid}`).set(contact) ;
	}else if(this.mode === 'contacts'){
	    contacts.push(contact);
	    this.store.dispatch(new ActivatedContactsAction(contacts))  ;
	}
    }
    
    inCollection(context){
	return this.getCollection(this.mode).some(c => c.uid === context.uid) ? '#ffc0c0' : '#fff';
    
    }
    
    getCollection(mode){
        return mode === 'users' ? this.store.selectSnapshot(AppContextState.contacts) : this.store.selectSnapshot(AppContextState.activatedContacts);
    }
}

import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from "@angular/router";
import {AppContextState} from "../../../../store/states";
import {Select, Store} from "@ngxs/store";
import {Contact} from "../../../../classes/Classes";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {Actions} from "../../../../store/actions";
import ActivatedContactsAction = Actions.ActivatedContactsAction;
import {Location} from "@angular/common";
import {FirebaseDatabaseService} from "../../../../services/firebase-database.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LocalizationService} from "../../../../services/localization.service";

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent {
    
   public subscriptions = [];
    public showIconSelect = false;
    public header = this.localizationService.getText(94);
    public from : string;
    public contactGroup : FormGroup;
    public activatedContacts : Contact[] = this.store.selectSnapshot(AppContextState.activatedContacts);
    public activatedContact : Contact = this.activatedContacts[0];
    public appUser = this.store.selectSnapshot(AppContextState.appUser);
    public buttons = [
	{className : 'back-icon', icon: 'back', tip : this.localizationService.getText(97), listener : this.onClickBack.bind(this), menu : false} ,
	{className : 'new-field-icon', icon : 'plus', tip : this.localizationService.getText(98), listener : this.onNewField.bind(this), menu : true} ,
	{className : 'save-icon', icon : 'check', tip : this.localizationService.getText(99), listener : this.onSave.bind(this), menu : false} ,
    
    ];
    public formFields = [
	{label : 'Идентификатор', inputType : 'text', type : 'text', enabled : this.appUser.isAnonymous, placeHolder : '', readOnly : true, controlName : 'uid'},
	{label : this.localizationService.getText(100), inputType : 'text', type : 'text', enabled : !!this.activatedContact.secondName, placeHolder : this.localizationService.getText(102), controlName : 'secondName'},
	{label : this.localizationService.getText(101), inputType : 'text', type : 'text', enabled : !!this.activatedContact.thirdName , placeHolder : this.localizationService.getText(103), controlName : 'thirdName'},
	{label : 'Email', inputType : 'email', type : 'text', enabled : !!this.activatedContact.email, placeHolder : 'Email контакта', controlName : 'email'},
	{label : this.localizationService.getText(4), inputType : 'tel', type : 'text', enabled : !!this.activatedContact.phoneNumber, placeHolder : this.localizationService.getText(104), controlName : 'phone'},
	{label : this.localizationService.getText(105), inputType : 'textarea', type : 'textarea', enabled : !!this.activatedContact.note, placeHolder : this.localizationService.getText(105), controlName : 'note'},
    ]  ;

    @Select(AppContextState.contacts) public contacts$: Observable<Contact[]>;
    @Select(AppContextState.appUser) public appUser$: Observable<Contact>;
  
    constructor(
	private router : Router,
	public localizationService : LocalizationService,
	public changeRef : ChangeDetectorRef,
	private location : Location,
	public firebaseDatabase : FirebaseDatabaseService,
	private snackBar: MatSnackBar,
	public store : Store) {
	this.from = this.router.getCurrentNavigation().extras.state.from;
	this.subscriptions.push(this.appUser$.subscribe(appUser => {
	    if(appUser){
		let result = this.store.selectSnapshot(AppContextState.activatedContacts).map(cont => {
		    if(cont.uid === appUser.uid){
			cont = appUser;
		    }
		    return cont;
		});
		this.store.dispatch(new ActivatedContactsAction(result)).toPromise().then(res => {
		    this.initActiveControls();
		});
	    }
	}) );
    }

  ngOnInit(): void {
        this.header = {contacts : this.localizationService.getText(94), settings : this.localizationService.getText(95)}[this.from];
        if( this.from === 'contacts'){
	    this.subscriptions.push(this.contacts$.subscribe(contacts => {
		let cons = contacts.filter(cont => {
		    return this.activatedContacts.some(c => c.uid === cont.uid)
		});
		if(cons.length) {
		    this.store.dispatch(new ActivatedContactsAction(cons)).toPromise().then(res => {
			this.initActiveControls();
		    })
		}
	    }));
	}else this.initActiveControls();
  }
    getSrc(){
		return this.activatedContact.photoURL;

    }
  ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.store.dispatch(new ActivatedContactsAction([])) ;
  }
    
    errorUrl(that){
		that.src = '/assets/icons/user.svg';
	return true;
    }
  
  initActiveControls(){
      this.activatedContacts = this.store.selectSnapshot(AppContextState.activatedContacts);
      this.activatedContact = this.activatedContacts[0];
      this.contactGroup = new FormGroup({
	  userName: new FormControl( this.activatedContact.userName || this.activatedContact.displayName || '', Validators.required),
	  uid : new FormControl( this.activatedContact.uid || ''),
	  secondName: new FormControl( this.activatedContact.secondName || ''),
	  thirdName: new FormControl( this.activatedContact.thirdName || ''),
	  email: new FormControl( this.activatedContact.email || '', Validators.email),
	  phone: new FormControl( this.activatedContact.phoneNumber || '', Validators.pattern("[0-9]{9,12}")),
	  note : new FormControl(this.activatedContact.note || ''),
      });
      for(let key in this.activatedContact){
          let field = this.formFields.filter(el => el.controlName === key + 'Control')[0];
	  field && (field.enabled = this.activatedContact[key] && (key + 'Control' === field.controlName));
      }
      this.changeRef.detectChanges();
  }
    
    onContactIconClick(prop){
	prop.event && prop.event.stopPropagation();
	this.showIconSelect = prop.type;
	prop.sniper && this.snackBar.open(this.localizationService.getText(1), '', {duration : 2000, horizontalPosition : 'center'});
	this.changeRef.markForCheck();
    }
    onSave(){
        this.activatedContact = {...this.activatedContact, ...this.contactGroup.value};
        //Переход в компонент перешел с компонента Settings. Т.е. редактируется текущий пользователь
        if(this.from === 'settings'){
	    this.firebaseDatabase.database.ref(`/users/${this.activatedContact.uid}`).update(this.activatedContact);
	//Переход в компонент перешел из компонента Contacts. Редактируется контакт пользователя.
	}else if(this.from === 'contacts'){
	    this.firebaseDatabase.database.ref(`/contacts/${this.store.selectSnapshot(AppContextState.appUser).uid}/${this.activatedContact.uid}`).update(this.activatedContact);
	}
 
        this.snackBar.open(this.localizationService.getText(1), '', {duration : 2000, horizontalPosition : 'center'});
	}
    
    onNewField(){}
    
    filterFields(fields) : string[] {
       return fields.filter(prop => !prop.enabled).map(prop => prop.label);
    }
    
    onClickMenu(pr){
        this.formFields.find(prop => prop.label === pr).enabled = true;
    }
    
    onClickBack(){
        this.location.back();
    }
}

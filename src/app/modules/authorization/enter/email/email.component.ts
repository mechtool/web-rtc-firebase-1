import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngxs/store";
import {ActivatedRoute} from "@angular/router";
import {ColorThemeService} from "../../../../services/color-theme.service";
import {Actions} from "../../../../store/actions";
import AppUserAction = Actions.AppUserAction;
import {Contact, UserContact} from "../../../../classes/Classes";

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
    
    public cursor = 'not-allowed';
    public formType = 'singUp';
    public formHeader = 'Регистрация в приложении';
    public loginPassError : string = '';
    public loginButtonText = 'Регистрировать';
    public activeStage = true;
    public loginPassGroup = new FormGroup({
	loginControl: new FormControl('', [Validators.required]),
	passControl: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
    
    constructor(
	public http : HttpClient,
	public store : Store,
	public changeRef : ChangeDetectorRef,
	public activatedRoute : ActivatedRoute,
	public colorService: ColorThemeService,
    ) {
	this.loginPassGroup.statusChanges.subscribe(res => {
	    this.activeStage = res !== 'VALID';
	    this.cursor = res === 'VALID' ? 'pointer' : 'not-allowed';
	})
    }
    
    ngOnInit(): void {
	this.activatedRoute.queryParamMap.subscribe((mode : any) => {
	    let loginControl = this.loginPassGroup.get('loginControl');
	    this.formType = mode.params.type;
	    if(this.formType === 'singIn'){
		this.formHeader = 'Вход в приложение';
		this.loginButtonText = 'Войти';
		loginControl.clearAsyncValidators();
		
	    }else{
		this.formHeader = 'Регистрация в приложении';
		this.loginButtonText = 'Регистрировать';
	    }
	})
    }
    
    setPasswordUser(user){

	this.store.dispatch(new AppUserAction(user));
    }
    
    onClickButton(){
	if(this.loginPassGroup.valid){
	    this.loginPassError = '';
	    this.cursor = 'not-allowed' ;
	    this.activeStage = true;
	    this.changeRef.markForCheck();
	    if(/singUp/.test(this.formType)){
		//регистрация
		let contact = new Contact({userName : this.loginPassGroup.value.loginControl, password : this.loginPassGroup.value.passControl, backColor : this.colorService.getThemeColor('color')});
		this.http.post('/create-user',  {user : new UserContact({uid : contact.uid,  contact : contact})}).subscribe(async (userContact : any) => {
		    //Возвращается созданный пользователь
		    if(userContact.contact){
			this.setPasswordUser(userContact.contact);
		    }else{
			this.loginPassError = 'Ошибка создания пользователя';
			this.cursor = 'pointer' ;
			this.activeStage = false;
			this.changeRef.markForCheck();
		    }
		})
	    }else{

	    }
	}
    }

}

import {ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppContextService} from "../../../../services/app-context.service";
import {Router} from "@angular/router";
import {FirebaseAuthService} from "../../../../services/firebase-auth.service";
import {LocalizationService} from "../../../../services/localization.service";
import {NAVIGATOR} from "../../../../classes/Globals";
import {STATES} from "../../../../classes/Classes";

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.css']
})
export class PhoneComponent implements OnInit, OnDestroy{
    
    public subscriptions = [];
    public phoneBlockClass = true;
    public phoneCodeError : boolean | string = false;
    public cursor = 'not-allowed';
    public activeStage = true;
    public progress = false;
    public errors = {
        "auth/captcha-check-failed": this.localizationService.getText(7) ,
	"auth/invalid-phone-number" : this.localizationService.getText(8),
	"auth/missing-phone-number" : this.localizationService.getText(9),
	"auth/quota-exceeded" : this.localizationService.getText(10),
	"auth/user-disabled" : this.localizationService.getText(11),
	"auth/operation-not-allowed" : this.localizationService.getText(12),
	"timeout" : this.localizationService.getText(13),
    };
    
    public states = STATES;
    public selected = this.states.find((el) => {
	return this.navigator.language.indexOf(el.class) >= 0;
    });
    public phoneGroup = new FormGroup({
	codeControl: new FormControl(this.selected, [Validators.required]),
	phoneControl: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
    });
    @ViewChild('buttonBlock', {read : ElementRef}) public buttonBlock : ElementRef;
    
    constructor(
	public appContext : AppContextService,
	public router : Router,
	private ngZone : NgZone,
	private renderer : Renderer2,
	public changeDetectorRef : ChangeDetectorRef,
	public firebaseService : FirebaseAuthService,
	public localizationService : LocalizationService,
	@Inject(NAVIGATOR) public navigator : Navigator,
    ) {}
    
    ngOnInit(): void {
	this.subscriptions.push(this.phoneGroup.valueChanges.subscribe(res => {
	    if(this.phoneGroup.status === 'VALID') {
	    }else if(this.phoneGroup.status === 'INVALID'){
		this.cursor = 'not-allowed';
		this.activeStage = true;
	    }
	    this.changeDetectorRef.markForCheck();
	}));
    }
    
    
    ngOnDestroy(): void {
        this.appContext.clearRecaptcha();
	this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    
    onHelp(){
        let parent = this.buttonBlock.nativeElement,
	    old = parent.querySelector('div');
        old && this.renderer.removeChild(parent, old);
    }
    
    onKeyDown($event){
	if(/Backspace|[0-9]/i.test($event.key)){
	}else $event.preventDefault();
    }
    
    onKeyPress(){
        let that = this;
	if(this.phoneGroup.invalid) {
	    this.cursor = 'not-allowed';
	}
	else  {
	    this.cursor = 'pointer';
	    this.activeStage = false;
	    if(!this.appContext.recaptchaVerifier){
	    	this.appContext.recaptchaVerifier =  new this.firebaseService.firebase.auth.RecaptchaVerifier('phone-ready', 		{
		    'size': 'invisible',
		    'callback': this.onClickPhoneButton,
		    'expired-callback': function (err) {
			console.log('Timeout : recaptcha')  ;
			that.phoneCodeError = that.localizationService.getText(6);
			let t = setTimeout(()=> {
			    clearTimeout(t);
			    that.onCancelButton();
			}, 1000);
			return true;
		    }
	    	}) ;
		this.appContext.recaptchaVerifier.render().then(res => {
		    console.log('***');
		}).catch(err=> {
		    console.error(err);
		    this.appContext.clearRecaptcha();
		    this.phoneCodeError = this.errors[err.code] || this.localizationService.getText(14);
		});
	    }
	}
    }
    
    onClickPhoneButton() {
        let that = this;
	if (this.phoneGroup.valid) {
	    this.progress = this.activeStage = true;
	    this.cursor = 'not-allowed';
	   this.changeDetectorRef.markForCheck();
	    this.firebaseService.auth.signInWithPhoneNumber(this.phoneGroup.get('codeControl').value.code + this.phoneGroup.get('phoneControl').value, this.appContext.recaptchaVerifier).then((confirmation) => {
		//Sms отправлено. Выдать оповещение пользователю о необходимости
		// ввести код из полученного сообщения в форму проверки sms кода
		// confirmationResult.confirm(code).
		this.appContext.confirmation = confirmation;
		this.progress = false;
		this.onHelp();
		this.ngZone.run(() => {
		    this.router.navigateByUrl('/authorization/enter/sms').then(res => {
			this.appContext.clearRecaptcha();
		    }).catch(err => {
		        console.error(err)
		    })
		});
	    }).catch(function (err) {
		console.error(err);
		that.phoneCodeError = that.errors[err.code] || that.localizationService.getText(15);
		//sms не отправлено
		that.activeStage = true;
		that.cursor = 'not-allowed';
		that.phoneGroup.get('phoneControl').setValue('');
		that.changeDetectorRef.markForCheck();
	    })
	}
    }
    
    onCancelButton(){
        //Удалить рекапчу
	this.appContext.clearRecaptcha();
	//Переход на страницу выбора провайдера
	this.router.navigateByUrl('/authorization').then(()=>{});
    }

}

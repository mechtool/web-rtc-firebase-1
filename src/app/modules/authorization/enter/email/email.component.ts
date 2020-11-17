import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FirebaseAuthService} from "../../../../services/firebase-auth.service";
import {ColorThemeService} from "../../../../services/color-theme.service";
import {LocalizationService} from "../../../../services/localization.service";

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit, OnDestroy {
    
    public subscription = [];
    public cursor = 'not-allowed';
    public reminderColor = '#aaa' ;
    public reminderDisabled = true;
    public emailPassError : string = '';
    public activeStage = true;
    public progress = false;
    public errors = {
	"auth/invalid-email" : this.localizationService.getText(36),
	"auth/user-disabled" : this.localizationService.getText(37),
	"auth/user-not-found" : this.localizationService.getText(38),
	"auth/wrong-password" : this.localizationService.getText(39),
	"auth/email-already-in-use" : this.localizationService.getText(40),
	"auth/operation-not-allowed": this.localizationService.getText(41),
	"auth/weak-password": this.localizationService.getText(42),
	"auth/missing-continue-uri" : this.localizationService.getText(43),
	"auth/invalid-continue-uri" : this.localizationService.getText(44),
	"auth/unauthorized-continue-uri": this.localizationService.getText(45)
    }
    public emailPassGroup = new FormGroup({
	emailControl: new FormControl('', [Validators.required, Validators.email]),
	passControl: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
    
    constructor(
        public localizationService : LocalizationService,
        public colorService : ColorThemeService,
        public firebaseService : FirebaseAuthService,
	public changeRef : ChangeDetectorRef,
    ) {
	this.subscription.push(this.emailPassGroup.statusChanges.subscribe(res => {
	    this.activeStage = res !== 'VALID';
	    this.cursor = res === 'VALID' ? 'pointer' : 'not-allowed';
	    this.changeRef.detectChanges();
	}) );
	this.subscription.push(this.emailPassGroup.get('emailControl').statusChanges.subscribe(res =>{
	    this.reminderDisabled = res !== 'VALID';
	    this.reminderColor = this.reminderDisabled ? '#aaa': this.colorService.getThemeColor('backgroundColor');
	    this.changeRef.detectChanges();
	    
	}))
    }
    
    ngOnInit(): void {

    }
    
    onRemindPass(){
	let emailValue = this.emailPassGroup.get("emailControl").value;
	emailValue && this.firebaseService.auth.sendPasswordResetEmail(emailValue, {url : 'https://web-rtc-firebase-60109.firebaseapp.com/',  handleCodeInApp: true}).then(res => {
	    //Пароль отправлен - направить пользователю сообщение о необходимости проверить почту
	    this.emailPassError = this.localizationService.getText(46);
	}).catch(err => {
	    this.emailPassError = this.errors[err.code] || this.localizationService.getText(47);
	    //Отобразить полученную ошибку
	})
    }
    
    ngOnDestroy() {
        this.subscription.forEach(sub => sub.unsubscribe()) ;
    }
    
    checkBack(){
	this.cursor = 'pointer';
	this.activeStage = this.progress = false;
	this.changeRef.detectChanges();
    }
    
    onClickButton(){
        let email = this.emailPassGroup.value.emailControl,
	    pass = this.emailPassGroup.value.passControl;
        this.cursor = 'not-allowed';
        this.activeStage = this.progress = true;
        this.emailPassError = this.localizationService.getText(25);
	this.changeRef.detectChanges();
	this.firebaseService.auth.signInWithEmailAndPassword(email, pass).then(()=>{
	    this.emailPassError = this.localizationService.getText(48);
	}).catch(async (err) => {
	    if(err.code.indexOf('user-not-found') >= 0){
		this.emailPassError = this.localizationService.getText(49);
		this.changeRef.detectChanges();
		await this.firebaseService.auth.createUserWithEmailAndPassword(email, pass).then(res =>{
		    this.emailPassError = this.localizationService.getText(50);
		    this.checkBack();
		}).catch(err => {
		    console.error(err);
		    this.emailPassError =  this.errors[err.code];
		    this.checkBack();
		})
	    }else {
		console.error(err);
		this.emailPassError =  this.errors[err.code];
		this.checkBack();
	    }
	});
    }

}

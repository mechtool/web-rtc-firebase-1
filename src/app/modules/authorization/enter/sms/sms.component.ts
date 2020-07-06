import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Location} from "@angular/common";
import {AppContextService} from "../../../../services/app-context.service";

// @ts-ignore
@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.css']
})
export class SmsComponent implements OnInit, OnDestroy {
    
    public smsText = 'Введите код, полученный в SMS сообщении.';
    
    public smsFormGroup = new FormGroup({
	smsControl : new FormControl('', [Validators.required, Validators.pattern('[0-9]{6}')])
    })

  constructor(
      public appContext : AppContextService,
      public location : Location) { }

  ngOnInit(): void {

  }
  
  ngOnDestroy() {
      this.appContext.confirmation = undefined;
      this.appContext.recaptchaVerifier = undefined;
  }
    
    onReady(){
	this.appContext.confirmation && this.appContext.confirmation.confirm && this.appContext.confirmation.confirm(this.smsFormGroup.value.smsControl).then((result)=> {
	    // User signed in successfully.
	    var user = result.user;
	    // ...
	}).catch(function (error) {
	    // User couldn't sign in (bad verification code?)
	    // ...
	});
    }
  
    onCancelSms(){
       this.location.back();
    }
}

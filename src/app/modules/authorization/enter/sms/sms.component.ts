import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Location} from "@angular/common";
import {AppContextService} from "../../../../services/app-context.service";
import {LocalizationService} from "../../../../services/localization.service";

// @ts-ignore
@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.css']
})
export class SmsComponent implements OnInit, OnDestroy {
    
    public subscriptions = [];
    public activeStage = true;
    public progress = false;
    public cursor = 'not-allowed';
    public smsText = this.localizationService.getText(22);
    public errors = {
        "auth/invalid-verification-code" : this.localizationService.getText(23),
	"auth/missing-verification-code" : this.localizationService.getText(24),
    }
    
    public smsFormGroup = new FormGroup({
	smsControl : new FormControl('', [Validators.required, Validators.pattern('[0-9]{6}')])
    })

  constructor(
      public localizationService : LocalizationService,
      public changeDetectorRef : ChangeDetectorRef,
      public appContext : AppContextService,
      public location : Location) { }

  ngOnInit(): void {
      this.subscriptions.push(this.smsFormGroup.valueChanges.subscribe(res => {
	  if(this.smsFormGroup.status === 'VALID') {
	      this.cursor = 'pointer';
	      this.activeStage = false;
	  }else if(this.smsFormGroup.status === 'INVALID'){
	      this.cursor = 'not-allowed';
	      this.activeStage = true;
	  }
	  this.changeDetectorRef.markForCheck();
      }));
  }
  
  ngOnDestroy() {
      this.appContext.confirmation = undefined;
      this.appContext.recaptchaVerifier = undefined;
  }
    
    onKeyDown($event){
	if(/Backspace|[0-9]/i.test($event.key)){
	}else $event.preventDefault();
    }
  
    onReady(){
	if(this.appContext.confirmation && this.appContext.confirmation.confirm){
	    this.smsText = this.localizationService.getText(25);
	    this.progress = this.activeStage = true;
	    this.cursor = 'not-allowed';
	    this.changeDetectorRef.detectChanges();
	    this.appContext.confirmation.confirm(this.smsFormGroup.value.smsControl).then((result)=> {
	    	this.smsText = this.localizationService.getText(26);
	    	this.progress = false;
	}).catch((error)=> {
	    this.smsText = this.errors[error.code];
	    this.progress = false;
	    let t = setTimeout(()=>{
	        clearTimeout(t);
	        this.onCancelSms();
	    }, 500)
	});
    }   }
  
    onCancelSms(){
       this.location.back();
    }
}

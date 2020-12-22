var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
// @ts-ignore
let SmsComponent = class SmsComponent {
    constructor(appContext, location) {
        this.appContext = appContext;
        this.location = location;
        this.smsText = 'Введите код, полученный в SMS сообщении.';
        this.smsFormGroup = new FormGroup({
            smsControl: new FormControl('', [Validators.required, Validators.pattern('[0-9]{6}')])
        });
    }
    ngOnInit() {
    }
    ngOnDestroy() {
        this.appContext.confirmation = undefined;
        this.appContext.recaptchaVerifier = undefined;
    }
    onReady() {
        this.appContext.confirmation && this.appContext.confirmation.confirm && this.appContext.confirmation.confirm(this.smsFormGroup.value.smsControl).then((result) => {
            // User signed in successfully.
            var user = result.user;
            // ...
        }).catch(function (error) {
            // User couldn't sign in (bad verification code?)
            // ...
        });
    }
    onCancelSms() {
        this.location.back();
    }
};
SmsComponent = __decorate([
    Component({
        selector: 'app-sms',
        templateUrl: './sms.component.html',
        styleUrls: ['./sms.component.css']
    })
], SmsComponent);
export { SmsComponent };

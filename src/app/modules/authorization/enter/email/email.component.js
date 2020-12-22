var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Actions } from "../../../../store/actions";
var AppUserAction = Actions.AppUserAction;
import { Contact, UserContact } from "../../../../classes/Classes";
let EmailComponent = class EmailComponent {
    constructor(http, store, changeRef, activatedRoute, colorService) {
        this.http = http;
        this.store = store;
        this.changeRef = changeRef;
        this.activatedRoute = activatedRoute;
        this.colorService = colorService;
        this.subscription = [];
        this.cursor = 'not-allowed';
        this.formType = 'singUp';
        this.formHeader = 'Регистрация в приложении';
        this.loginPassError = '';
        this.loginButtonText = 'Регистрировать';
        this.activeStage = true;
        this.emailPassGroup = new FormGroup({
            emailControl: new FormControl('', [Validators.required]),
            passControl: new FormControl('', [Validators.required, Validators.minLength(8)]),
        });
        this.subscription.push(this.emailPassGroup.statusChanges.subscribe(res => {
            this.activeStage = res !== 'VALID';
            this.cursor = res === 'VALID' ? 'pointer' : 'not-allowed';
        }));
    }
    ngOnInit() {
        this.subscription.push(this.activatedRoute.queryParamMap.subscribe((mode) => {
            let loginControl = this.emailPassGroup.get('emailControl');
            this.formType = mode.params.type;
            if (this.formType === 'singIn') {
                this.formHeader = 'Вход в приложение';
                this.loginButtonText = 'Войти';
                loginControl.clearAsyncValidators();
            }
            else {
                this.formHeader = 'Регистрация в приложении';
                this.loginButtonText = 'Регистрировать';
            }
        }));
    }
    ngOnDestroy() {
        this.subscription.forEach(sub => sub.unsubscribe());
    }
    setPasswordUser(user) {
        this.store.dispatch(new AppUserAction(user));
    }
    onClickButton() {
        if (this.emailPassGroup.valid) {
            this.loginPassError = '';
            this.cursor = 'not-allowed';
            this.activeStage = true;
            this.changeRef.markForCheck();
            if (/singUp/.test(this.formType)) {
                //регистрация
                let contact = new Contact({ userName: this.emailPassGroup.value.emailControl, password: this.emailPassGroup.value.passControl, backColor: this.colorService.getThemeColor('color') });
                this.http.post('/create-user', { user: new UserContact({ uid: contact.uid, contact: contact }) }).subscribe((userContact) => __awaiter(this, void 0, void 0, function* () {
                    //Возвращается созданный пользователь
                    if (userContact.contact) {
                        this.setPasswordUser(userContact.contact);
                    }
                    else {
                        this.loginPassError = 'Ошибка создания пользователя';
                        this.cursor = 'pointer';
                        this.activeStage = false;
                        this.changeRef.markForCheck();
                    }
                }));
            }
            else {
            }
        }
    }
};
EmailComponent = __decorate([
    Component({
        selector: 'app-email',
        templateUrl: './email.component.html',
        styleUrls: ['./email.component.css']
    })
], EmailComponent);
export { EmailComponent };

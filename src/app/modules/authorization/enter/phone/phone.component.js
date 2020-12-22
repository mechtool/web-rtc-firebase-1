var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
let PhoneComponent = class PhoneComponent {
    constructor(appContext, router, ngZone, renderer, changeDetectorRef, firebaseService) {
        this.appContext = appContext;
        this.router = router;
        this.ngZone = ngZone;
        this.renderer = renderer;
        this.changeDetectorRef = changeDetectorRef;
        this.firebaseService = firebaseService;
        this.subscriptions = [];
        this.phoneBlockClass = true;
        this.phoneCodeError = false;
        this.phoneButtonText = 'Готово';
        this.cursor = 'not-allowed';
        this.activeStage = true;
        this.errors = {
            "auth/captcha-check-failed": "Проверка рекапчи отрицательна.",
            "auth/invalid-phone-number": "Некорректный номер телефона.",
            "auth/missing-phone-number": "Отсутствует номер телефона.",
            "auth/quota-exceeded": "Превышена квота.",
            "auth/user-disabled": "Пользователь неактивен.",
            "auth/operation-not-allowed": "Опрерация не разрешена.",
            "timeout": "Тайт аут рекапчи истек."
        };
        this.states = [
            { class: 'us', code: '+1', src: '/assets/flags-24/002-flag.png', alt: 'Флаг Америки' },
            { class: 'arm', code: '+374', src: '/assets/flags-24/007-armenia.png', alt: 'Флаг Армении' },
            { class: 'ru', code: '+7', src: '/assets/flags-24/001-russia.png', alt: 'Флаг России' },
            { class: 'kz', code: '+7', src: '/assets/flags-24/006-kazakhstan.png', alt: 'Флаг Казахстана' },
            { class: 'geo', code: '+995', src: '/assets/flags-24/009-georgia.png', alt: 'Флаг Грузии' },
            { class: 'de', code: '+49', src: '/assets/flags-24/004-germany.png', alt: 'Флаг Германии' },
            { class: 'uk', code: '+380', src: '/assets/flags-24/003-ukraine.png', alt: 'Флаг Украины' },
            { class: 'bel', code: '+375', src: '/assets/flags-24/005-belarus.png', alt: 'Флаг Беларуссии' },
            { class: 'est', code: '+372', src: '/assets/flags-24/008-estonia.png', alt: 'Флаг Эстонии' },
        ];
        this.selected = this.states.find((el) => {
            return window.navigator.language.indexOf(el.class) >= 0;
        });
        this.phoneGroup = new FormGroup({
            codeControl: new FormControl(this.selected, [Validators.required]),
            phoneControl: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
        });
    }
    ngOnInit() {
        this.subscriptions.push(this.phoneGroup.valueChanges.subscribe(res => {
            if (this.phoneGroup.status === 'VALID') {
            }
            else if (res === 'INVALID') {
                this.cursor = 'not-allowed';
                this.activeStage = true;
            }
            this.changeDetectorRef.markForCheck();
        }));
    }
    ngOnDestroy() {
        this.appContext.clearRecaptcha();
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    onHelp() {
        let parent = this.buttonBlock.nativeElement, old = parent.querySelector('div');
        old && this.renderer.removeChild(parent, old);
    }
    onKeyDown($event) {
        if (/Backspace|[0-9]/i.test($event.key)) {
        }
        else
            $event.preventDefault();
    }
    onKeyPress($event) {
        let that = this;
        this.activeStage = this.phoneGroup.invalid;
        if (this.phoneGroup.invalid) {
            this.cursor = 'not-allowed';
        }
        else {
            this.cursor = 'pointer';
            this.activeStage = false;
            if (!this.appContext.recaptchaVerifier) {
                this.appContext.recaptchaVerifier = new this.firebaseService.firebase.auth.RecaptchaVerifier('phone-ready', {
                    'size': 'invisible',
                    'callback': this.onClickPhoneButton,
                    'expired-callback': function (err) {
                        console.log('Timeout : recaptcha');
                        that.phoneCodeError = 'Ожидание ввода истекло.';
                        let t = setTimeout(() => {
                            clearTimeout(t);
                            that.onCancelButton();
                        }, 1000);
                        return true;
                    }
                });
                this.appContext.recaptchaVerifier.render().then(res => {
                    console.log('***');
                }).catch(err => {
                    console.error(err);
                    this.appContext.clearRecaptcha();
                    this.phoneCodeError = this.errors[err.code] || 'Ошибка работы рекапчи.';
                });
            }
        }
    }
    onClickPhoneButton() {
        let that = this;
        if (this.phoneGroup.valid) {
            this.activeStage = true;
            this.cursor = 'not-allowed';
            this.changeDetectorRef.markForCheck();
            this.firebaseService.auth.signInWithPhoneNumber(this.phoneGroup.get('codeControl').value.code + this.phoneGroup.get('phoneControl').value, this.appContext.recaptchaVerifier).then((confirmation) => {
                //Sms отправлено. Выдать оповещение пользователю о необходимости
                // ввести код из полученного сообщения в форму проверки sms кода
                // confirmationResult.confirm(code).
                this.appContext.confirmation = confirmation;
                this.ngZone.run(() => {
                    this.router.navigateByUrl('/authorization/enter/sms').then(res => {
                        this.appContext.clearRecaptcha();
                    }).catch(err => {
                        console.error(err);
                    });
                });
            }).catch(function (err) {
                console.error(err);
                that.phoneCodeError = that.errors[err.code] || 'Ошибка входа в приложение.';
                //sms не отправлено
                that.activeStage = true;
                that.cursor = 'not-allowed';
                that.phoneGroup.get('phoneControl').setValue('');
                that.changeDetectorRef.markForCheck();
            });
        }
    }
    onCancelButton() {
        //Удалить рекапчу
        this.appContext.clearRecaptcha();
        //Переход на страницу выбора провайдера
        this.router.navigateByUrl('/authorization').then(() => { });
    }
};
__decorate([
    ViewChild('buttonBlock', { read: ElementRef })
], PhoneComponent.prototype, "buttonBlock", void 0);
PhoneComponent = __decorate([
    Component({
        selector: 'app-phone',
        templateUrl: './phone.component.html',
        styleUrls: ['./phone.component.css']
    })
], PhoneComponent);
export { PhoneComponent };

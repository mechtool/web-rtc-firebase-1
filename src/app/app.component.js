var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, HostBinding, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Select } from "@ngxs/store";
import { AppContextState } from "./store/states";
import { isPlatformBrowser } from "@angular/common";
let AppComponent = class AppComponent {
    //todo Не убирать не активные сервисы. Они запускаются инжектором зависимостей и инициализируют сервисные механизмы. Очередность запусков сервисов соответствует очередности следования их в параметрах конструктора : порядок запуска важен!!!
    // #
    // # Сервис активации firebase
    // # Сервис аутентификации
    // # Сервис базы данных
    // # Сервис Push firebase сообщений
    // # Сервис firebase Storage
    // # Сервис настроек по умолчанию
    // # Сервис цветовой схемы
    // # Сервис  активности сети
    //
    constructor(firebaseService, firebaseAuth, firebaseDatabase, firebaseMessaging, firebaseStorage, settingsService, colorTheme, onlineService, router, zone, sanitizer, changeRef, iconRegistry, platformId) {
        this.firebaseService = firebaseService;
        this.firebaseAuth = firebaseAuth;
        this.firebaseDatabase = firebaseDatabase;
        this.firebaseMessaging = firebaseMessaging;
        this.firebaseStorage = firebaseStorage;
        this.settingsService = settingsService;
        this.colorTheme = colorTheme;
        this.onlineService = onlineService;
        this.router = router;
        this.zone = zone;
        this.sanitizer = sanitizer;
        this.changeRef = changeRef;
        this.iconRegistry = iconRegistry;
        this.platformId = platformId;
        this.subscribes = [];
    }
    //Потеря фокуса
    onBlur() {
        console.log('onblur');
    }
    //Востановление фокуса
    onFocus() {
        console.log('onfocus');
    }
    ngOnDestroy() {
        this.subscribes.forEach(sub => sub.unsubscribe());
    }
    ngOnInit() {
        //Если браузер
        if (isPlatformBrowser(this.platformId)) {
            //регистрация иконки в реестре иконок
            [
                { name: 'start-contacts', link: '/assets/icons/avatar.svg' },
                { name: 'back', link: '/assets/icons/back.svg' },
                { name: 'menu', link: '/assets/icons/menu.svg' },
                { name: 'download', link: '/assets/icons/sheet.svg' },
                { name: 'user', link: '/assets/icons/user.svg' },
                { name: 'user1', link: '/assets/icons/user1.svg' },
                { name: 'user2', link: '/assets/icons/user2.svg' },
                { name: 'detailed', link: '/assets/icons/alert.svg' },
                { name: 'start-announcements', link: '/assets/icons/bell.svg' },
                { name: 'start-messages', link: '/assets/icons/comment.svg' },
                { name: 'start-settings', link: '/assets/icons/settings.svg' },
                { name: 'start-phone', link: '/assets/icons/phone.svg' },
                { name: 'start-home', link: '/assets/icons/home.svg' },
                { name: 'settings1', link: '/assets/icons/sett.svg' },
                { name: 'settings2', link: '/assets/icons/gear.svg' },
                { name: 'logout', link: '/assets/icons/exit.svg' },
                { name: 'chrome', link: '/assets/icons/chrome.svg' },
                { name: 'wifi', link: '/assets/icons/wifi.svg' },
                { name: 'visibility', link: '/assets/icons/visibility.svg' },
                { name: 'visibility-off', link: '/assets/icons/visibility_off.svg' },
                { name: 'phone', link: '/assets/icons/phone1.svg' },
                { name: 'message', link: '/assets/icons/message.svg' },
                { name: 'play', link: '/assets/icons/multimedia.svg' },
                { name: 'delete', link: '/assets/icons/close.svg' },
                { name: 'plus', link: '/assets/icons/plus.svg' },
                { name: 'check', link: '/assets/icons/tick.svg' },
                { name: 'check1', link: '/assets/icons/tick1.svg' },
                { name: 'search', link: '/assets/icons/search.svg' },
                { name: 'help', link: '/assets/icons/question.svg' },
                { name: '0', link: '/assets/icons/paper-plane.svg' },
                { name: '1', link: '/assets/icons/video-camera.svg' },
                { name: '2', link: '/assets/icons/microphone.svg' },
            ].forEach(item => {
                this.iconRegistry.addSvgIcon(item.name, this.sanitizer.bypassSecurityTrustResourceUrl(item.link));
            });
            //Подписка на изменение пользователя
            this.subscribes.push(this.appUser$.subscribe(appUser => {
                let t = setTimeout(() => {
                    clearTimeout(t);
                    //Пользователь вошел в приложение
                    if (appUser && appUser.uid) {
                        //Пользователь вошео в приложение
                        this.zone.run(() => this.router.navigate(['application', 'splash']).catch(err => console.log(err)));
                    }
                    else if (appUser === null) {
                        //todo Реализовать проверку параметра вызова на случай входа в приложение через мобильную ссылку
                        //todo Пользователь вышел из приложения (или еще не вошел), запустить функции отчистки несохраняемых данных
                        //Перейти на страницу авторизации
                        this.zone.run(() => this.router.navigate(['authorization', 'enter']).catch(err => console.log(err)));
                    }
                }, 1000);
            }));
            this.subscribes.push(this.appColorClass$.subscribe((appColorClass) => {
                if (!/null|undefined/.test(appColorClass)) {
                    this.appColorClass = appColorClass;
                    this.changeRef.markForCheck();
                }
            }));
            //Подписка на отслеживание активности сети
            this.subscribes.push(this.onLine$.subscribe((onLine) => {
                if (onLine == false) {
                    this.router.navigate(['/application/online', { previousUrl: this.router.url }]);
                }
            }));
        }
    }
};
__decorate([
    HostBinding('class')
], AppComponent.prototype, "appColorClass", void 0);
__decorate([
    HostListener('window:blur')
], AppComponent.prototype, "onBlur", null);
__decorate([
    HostListener('window:focus')
], AppComponent.prototype, "onFocus", null);
__decorate([
    Select(AppContextState.appColorClass)
], AppComponent.prototype, "appColorClass$", void 0);
__decorate([
    Select(AppContextState.appUser)
], AppComponent.prototype, "appUser$", void 0);
__decorate([
    Select(AppContextState.onLine)
], AppComponent.prototype, "onLine$", void 0);
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    }),
    __param(13, Inject(PLATFORM_ID))
], AppComponent);
export { AppComponent };

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    HostListener,
    Inject,
    NgZone,
    OnDestroy,
    OnInit,
    PLATFORM_ID
} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {AppContextState} from "./store/states";
import {Observable} from "rxjs";
import {Contact} from "./classes/Classes";
import {ColorThemeService} from "./services/color-theme.service";
import {Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material/icon";
import {OnlineService} from "./services/online.service";
import {isPlatformBrowser} from "@angular/common";
import {FirebaseService} from "./services/firebase.service";
import {FirebaseAuthService} from "./services/firebase-auth.service";
import {FirebaseDatabaseService} from "./services/firebase-database.service";
import {FirebaseMessagingService} from "./services/firebase-messaging.service";
import {FirebaseStorageService} from "./services/firebase-storage.service";
import {HardwareService} from "./services/hardware.service";
import {SettingsDefaultService} from "./services/settings-default.service";
import {Actions} from "./store/actions";
import StartedStatusAction = Actions.StartedStatusAction;
import ChangeDetectorAction = Actions.ChangeDetectorAction;
import {SwUpdateService} from "./services/sw-update.service";

@Component({
  selector: 'app-root',
 templateUrl : './app.component.html',
    styleUrls : ['./app.component.css'],
    changeDetection : ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy{
    
    public subscribes = [];
    @HostBinding('class') public appColorClass;
    //Потеря фокуса
    @HostListener('window:blur') public onBlur(){
	console.log('onblur') ;
    }
    //Востановление фокуса
    @HostListener('window:focus') public onFocus(){
	console.log('onfocus') ;
    }
    
    @Select(AppContextState.appColorClass) public appColorClass$ : Observable<string> ;
    @Select(AppContextState.appUser) public appUser$ : Observable<Contact> ;
    @Select(AppContextState.onLine) public onLine$ : Observable<boolean> ;
    
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
    constructor(
        public firebaseService : FirebaseService,
	public firebaseAuth : FirebaseAuthService,
	public firebaseDatabase : FirebaseDatabaseService,
	public firebaseMessaging : FirebaseMessagingService,
	public firebaseStorage : FirebaseStorageService,
	public colorTheme : ColorThemeService,
	public onlineService : OnlineService,
	public hardwareService : HardwareService,
	public settingsDefaultService : SettingsDefaultService,
	public swUpdateService : SwUpdateService,
	public router : Router,
	public zone : NgZone,
	public store : Store,
	public sanitizer : DomSanitizer,
	public changeRef : ChangeDetectorRef,
	public iconRegistry : MatIconRegistry,
	@Inject(PLATFORM_ID) private platformId: Object) {}
    
    ngOnDestroy(){
	this.subscribes.forEach(sub => sub.unsubscribe());
    }
    
    ngOnInit() {
	//Если браузер
	if (isPlatformBrowser(this.platformId)) {
	    //регистрация иконки в реестре иконок
	    [
		{name : 'start-contacts', link: '/assets/icons/avatar.svg'},
		{name : 'back', link: '/assets/icons/back.svg'},
		{name : 'stop', link: '/assets/icons/stop.svg'},
		{name : 'update', link: '/assets/icons/download.svg'},
		{name : 'download', link: '/assets/icons/sheet.svg'},
		{name : 'user', link: '/assets/icons/user.svg'},
		{name : 'user1', link: '/assets/icons/user1.svg'},
		{name : 'user2', link: '/assets/icons/user2.svg'},
		{name : 'detailed', link: '/assets/icons/alert.svg'},
		{name : 'start-announcements', link: '/assets/icons/bell.svg'},
		{name : 'start-messages', link: '/assets/icons/comment.svg'},
		{name : 'start-settings', link: '/assets/icons/settings.svg'},
		{name : 'start-phone', link: '/assets/icons/phone.svg'},
		{name : 'settings2', link: '/assets/icons/gear.svg'},
		{name : 'exit', link: '/assets/icons/exit.svg'},
		{name : 'sms', link: '/assets/icons/SMS.svg'},
		{name : 'wifi', link: '/assets/icons/wifi.svg'},
		{name : 'visibility', link: '/assets/icons/visibility.svg'},
		{name : 'visibility-off', link: '/assets/icons/visibility_off.svg'},
		{name : 'phone', link: '/assets/icons/phone1.svg'},
		{name : 'message', link: '/assets/icons/message.svg'},
		{name : 'delete', link: '/assets/icons/close.svg'},
		{name : 'plus', link: '/assets/icons/plus.svg'},
		{name : 'check', link: '/assets/icons/tick.svg'},
		{name : 'check1', link: '/assets/icons/tick1.svg'},
		{name : 'search', link: '/assets/icons/search.svg'},
		{name : 'help', link: '/assets/icons/question.svg'},
		{name : 'sound', link: '/assets/icons/sound.svg'},
	 
		{name : '0', link: '/assets/icons/paper-plane.svg'},
		{name : '1', link: '/assets/icons/video-camera.svg'},
		{name : '2', link: '/assets/icons/microphone.svg'},
	    
	    ].forEach(item => {
		this.iconRegistry.addSvgIcon(item.name, this.sanitizer.bypassSecurityTrustResourceUrl(item.link));
	    }) ;
	    //Подписка на изменение пользователя
	    this.subscribes.push(this.appUser$.subscribe(appUser => {
		//Пользователь вошел в приложение
		if (appUser && appUser.uid && this.router.url.indexOf('application/main/contact-detail') < 0) {
		    this.zone.run(() => this.router.navigate(['application', 'splash'])
			.then(() => {
			    this.store.dispatch(new StartedStatusAction(true));
			})
			.catch(err =>
			    console.log(err))
		    );
		} else if (appUser === null) {
		    //todo Реализовать проверку параметра вызова на случай входа в приложение через мобильную ссылку
		    //todo Пользователь вышел из приложения (или еще не вошел), запустить функции отчистки несохраняемых данных
		    //Перейти на страницу авторизации
		    this.zone.run(() => this.router.navigate(['authorization', 'enter'])
			.then(() => {
			    this.store.dispatch(new StartedStatusAction(false))
			})
			.catch(err => {
			    console.log(err)
			}));
		} else if (this.router.url.length === 1 && /\//.test(this.router.url)) {
		    this.zone.run(() => this.router.navigate(['authorization']))
		}
	    }));
	    //Подписка на изменение цветовой темы
	    this.subscribes.push(this.appColorClass$.subscribe((appColorClass : any) => {
		if (!/null|undefined/.test(appColorClass)) {
		    this.appColorClass = appColorClass;
		    this.changeRef.markForCheck();
		}
	    }));
	    //Подписка на отслеживание активности сети
	    this.subscribes.push(this.onLine$.subscribe((onLine : boolean) => {
		if (onLine == false) {
		   this.router.navigate(['/application/online', {previousUrl: this.router.url}]) ;
		}
	    }));
	    //Инициализация детектора изменений приложения в хранилще
	    this.store.dispatch(new ChangeDetectorAction(this.changeRef));
	}
    }
}

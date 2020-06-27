import {ChangeDetectorRef, Component, HostBinding, HostListener, Inject, NgZone, PLATFORM_ID} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppContextState} from "./store/states";
import {Observable} from "rxjs";
import {Contact} from "./classes/Classes";
import {ColorThemeService} from "./services/color-theme.service";
import {Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material/icon";
import {OnlineService} from "./services/online.service";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-root',
 templateUrl : './app.component.html',
    styleUrls : ['./app.component.css']
})
export class AppComponent {
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
    
    constructor(
	public changeRef : ChangeDetectorRef,
	public colorTheme : ColorThemeService,
	public router : Router,
	public zone : NgZone,
	public sanitizer : DomSanitizer,
	public iconRegistry : MatIconRegistry,
	public onLineService : OnlineService,
	@Inject(PLATFORM_ID) private platformId: Object) {
	
	if (isPlatformBrowser(this.platformId)) {
	    this.initializeServices();
	}
    }
    
    async initializeServices(){
	await this.onLineService.initialize();
	await this.colorTheme.initialize();
    }
    
    ngOnInit() {
	//Если браузер
	if (isPlatformBrowser(this.platformId)) {
	    //регистрация иконки в реестре иконок
	    [
		{name : 'start-contacts', link: '/assets/icons/avatar.svg'},
		{name : 'back', link: '/assets/icons/back.svg'},
		{name : 'menu', link: '/assets/icons/menu.svg'},
		{name : 'download', link: '/assets/icons/sheet.svg'},
		{name : 'user', link: '/assets/icons/user.svg'},
		{name : 'user1', link: '/assets/icons/user1.svg'},
		{name : 'user2', link: '/assets/icons/user2.svg'},
		{name : 'detailed', link: '/assets/icons/alert.svg'},
		{name : 'start-announcements', link: '/assets/icons/bell.svg'},
		{name : 'start-messages', link: '/assets/icons/comment.svg'},
		{name : 'start-settings', link: '/assets/icons/settings.svg'},
		{name : 'start-phone', link: '/assets/icons/phone.svg'},
		{name : 'start-home', link: '/assets/icons/home.svg'},
		{name : 'settings1', link: '/assets/icons/sett.svg'},
		{name : 'settings2', link: '/assets/icons/gear.svg'},
		{name : 'logout', link: '/assets/icons/exit.svg'},
		{name : 'chrome', link: '/assets/icons/chrome.svg'},
		{name : 'wifi', link: '/assets/icons/wifi.svg'},
		{name : 'visibility', link: '/assets/icons/visibility.svg'},
		{name : 'visibility-off', link: '/assets/icons/visibility_off.svg'},
		
		{name : 'message', link: '/assets/icons/message.svg'},
		{name : 'play', link: '/assets/icons/multimedia.svg'},
		{name : 'delete', link: '/assets/icons/close.svg'},
		{name : 'plus', link: '/assets/icons/plus.svg'},
		{name : 'check', link: '/assets/icons/tick.svg'},
		{name : 'check1', link: '/assets/icons/tick1.svg'},
		{name : 'search', link: '/assets/icons/search.svg'},
		
		{name : '0', link: '/assets/icons/paper-plane.svg'},
		{name : '1', link: '/assets/icons/video-camera.svg'},
		{name : '2', link: '/assets/icons/microphone.svg'},
	    
	    ].forEach(item => {
		this.iconRegistry.addSvgIcon(item.name, this.sanitizer.bypassSecurityTrustResourceUrl(item.link));
	    }) ;
	    
	    this.subscribes.push(this.appUser$.subscribe(appUser => {
		if(appUser && appUser._id){

		} else{
		    //todo Пользователь вышел из приложения, запустить функции отчистки несохраняемых данных
		    //Выйти из приложения с переходом на страницу авторизации
		    //this.zone.run(()=> this.router.navigateByUrl('/authorization')).catch(err => console.log(err));
		}
	    })) ;
	    this.subscribes.push(this.appColorClass$.subscribe((appColorClass : any) => {
		if (!/null|undefined/.test(appColorClass)) {
		    this.appColorClass = appColorClass;
		    this.changeRef.markForCheck();
		}
	    }));
	    this.subscribes.push(this.onLine$.subscribe((onLine : boolean) => {
		if (onLine == false) {
		   // this.router.navigate(['/application/online', {previousUrl: this.router.url}]) ;
		}
	    }));
	}
    }
    
    ngOnDestroy(){
	this.subscribes.forEach(sub => sub.unsubscribe());
    }
}

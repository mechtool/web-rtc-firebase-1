import {Injectable, NgZone} from '@angular/core';
import { Router} from "@angular/router";
import {Store} from "@ngxs/store";
import {Actions} from "../store/actions";
import AppPermissionsAction = Actions.AppPermissionsAction;
import {FirebaseMessagingService} from "./firebase-messaging.service";
import {AppContextState} from "../store/states";

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
    
    public forbidden = [];
    public permissions : PermissionDescriptor[] = [{name :'notifications'}, {name : 'camera'}];
    public permCollection = [
	{name : 'notifications', state : 'granted', className : 'permission-notifications',  click : this.checkNotifications.bind(this) },
	{name : 'camera', state : 'granted', className : 'permission-camera', click : this.checkCamera.bind(this)}
    ];
    constructor(
        public zone :NgZone,
        public store : Store,
        public router : Router,
	public firebaseMessaging : FirebaseMessagingService ) {}
    
    checkNotifications(){
	    this.firebaseMessaging.getToken();
    }
    
    checkCamera(check = true){
	navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(stream => {
	    stream.getTracks().forEach(tr => tr.stop());
	}).catch(err => {
	    console.log('Пользователь отклонил разрешение на использование камеры и микрофона.')
	}).finally(() => check && this.checkPermissions()) ;
    }
    
    checkPermissions(){
	let that = this;
	this.forbidden = [] ;
	//Проверка разрешений на использование камеры, микрофона и уведомлений
	Promise.all(this.permissions.map(desc => navigator.permissions.query(desc))).then(res => {
	    //Установка обработчиков на изменения статуса разрешений
	    res.forEach(r => {
		r.onchange = function(event) {
		    that.checkPermissions()
		} ;
	    })
	    //Если все разрешения даны
	    if(res.every(r => r.state === 'granted')) {
	        //Если разрешения все присутствуют, а у текущего пользователя нет токена сообщений - значит был создан новый пользователь у которого отсутстует токен сообщений. Получаем токен сообщения для пользователя с отсутствующем токеном.
		this.store.selectSnapshot(AppContextState.appUser).messToken || this.firebaseMessaging.getToken();
		//Проверка, что текущий маршрут - permissions
	        if(this.router.url.indexOf('permissions') > -1){
		    this.zone.run(()=> this.router.navigateByUrl('/application/splash'));
		}
	    }
	    else {
	        res.forEach((r, inx) => {
	            if(!(/granted/.test(r.state))){
		      let p = Object.assign({}, this.permCollection[inx]);
		      p.state = r.state;
		      this.forbidden.push(p);
		    }
	        }) ;
	        if(this.forbidden.length){
	            this.store.dispatch(new AppPermissionsAction(this.forbidden));
	            this.zone.run(()=> this.router.navigateByUrl('/application/permissions')) ;
		}
	    }
	})
    }
}

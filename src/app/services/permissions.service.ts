import {Injectable, NgZone} from '@angular/core';
import { Router} from "@angular/router";
import {Store} from "@ngxs/store";
import {Actions} from "../store/actions";
import AppPermissionsAction = Actions.AppPermissionsAction;

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
    
    public activeCollections = [];
    public permissions : PermissionDescriptor[] = [{name :'notifications'}, {name : 'camera'}];
    public permCollection = [
	{name : 'notifications', state : 'granted', className : 'permission-notifications',  click : this.checkNotifications.bind(this) },
	{name : 'camera', state : 'granted', className : 'permission-camera', click : this.checkCamera.bind(this)}
    ];
    constructor(
        public zone :NgZone,
        public store : Store,
        public router : Router) {}
    
    checkNotifications(check = true){
/*        this.push.requestSubscription().then((res)=>{
             check && this.checkPermissions();
	})*/
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
	this.activeCollections = [] ;
	//Проверка разрешений на использование камеры, микрофона и уведомлений
	Promise.all(this.permissions.map(desc => navigator.permissions.query(desc))).then(res => {
	    if(res.every(r => r.state === 'granted')) {
	        if(this.router.url.indexOf('permissions') > -1){
		    this.zone.run(()=> this.router.navigateByUrl('/application/splash'));
		}
	    }
	    else {
	        res.forEach((r, inx) => {
		    if(!(/granted/.test(r.state))){
		      let p = Object.assign({}, this.permCollection[inx]);
		      p.state = r.state;
		      r.onchange = function(event) {
		          that.checkPermissions()
		      }   ;
		      this.activeCollections.push(p);
		    }
	        }) ;
	        if(this.activeCollections.length){
	            this.store.dispatch(new AppPermissionsAction(this.activeCollections));
	            this.zone.run(()=> this.router.navigateByUrl('/application/permissions')) ;
		}
	    }
	})
    }
}

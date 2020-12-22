var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { Actions } from "../store/actions";
var AppPermissionsAction = Actions.AppPermissionsAction;
let PermissionsService = class PermissionsService {
    constructor(zone, store, router) {
        this.zone = zone;
        this.store = store;
        this.router = router;
        this.activeCollections = [];
        this.permissions = [{ name: 'notifications' }, { name: 'camera' }];
        this.permCollection = [
            { name: 'notifications', state: 'granted', className: 'permission-notifications', click: this.checkNotifications.bind(this) },
            { name: 'camera', state: 'granted', className: 'permission-camera', click: this.checkCamera.bind(this) }
        ];
    }
    checkNotifications(check = true) {
        /*        this.push.requestSubscription().then((res)=>{
                     check && this.checkPermissions();
            })*/
    }
    checkCamera(check = true) {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
            stream.getTracks().forEach(tr => tr.stop());
        }).catch(err => {
            console.log('Пользователь отклонил разрешение на использование камеры и микрофона.');
        }).finally(() => check && this.checkPermissions());
    }
    checkPermissions() {
        let that = this;
        this.activeCollections = [];
        //Проверка разрешений на использование камеры, микрофона и уведомлений
        Promise.all(this.permissions.map(desc => navigator.permissions.query(desc))).then(res => {
            if (res.every(r => r.state === 'granted')) {
                if (this.router.url.indexOf('permissions') > -1) {
                    this.zone.run(() => this.router.navigateByUrl('/application/splash'));
                }
            }
            else {
                res.forEach((r, inx) => {
                    if (!(/granted/.test(r.state))) {
                        let p = Object.assign({}, this.permCollection[inx]);
                        p.state = r.state;
                        r.onchange = function (event) {
                            that.checkPermissions();
                        };
                        this.activeCollections.push(p);
                    }
                });
                if (this.activeCollections.length) {
                    this.store.dispatch(new AppPermissionsAction(this.activeCollections));
                    this.zone.run(() => this.router.navigateByUrl('/application/permissions'));
                }
            }
        });
    }
};
PermissionsService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], PermissionsService);
export { PermissionsService };

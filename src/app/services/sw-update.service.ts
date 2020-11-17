import { Injectable } from '@angular/core';
import {SwUpdate} from "@angular/service-worker";
import {AppContextService} from "./app-context.service";
import {PopupContext} from "../classes/Classes";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngxs/store";
import {LocalStorageState} from "../store/states";
import {v4 as uuid} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SwUpdateService {
    
    public update;
    public version = '1.0.0';
    //Признак запуска проверки через кнопку на странице настроек (вручную)
    public manually = false;
    constructor(
	private appContext : AppContextService,
	public store : Store,
	private swUpdate: SwUpdate,
	public http : HttpClient,
    ) {
        this.initialize();
    }
    
    //Инициализация
    initialize(){
        //Инициализация канала связи с сервисным рабочим
	let channel = new BroadcastChannel('sw-messages');
	//Подписка на событие передачи сообщения
	channel.addEventListener('message', event => {
	    if(event.data.type === 'version'){
		this.version = event.data.version;
		console.log('Received', event.data);
	    }
	});
	//Передача сообщения с требованием передать номер версии приложения
	channel.postMessage({type : 'version'});
 
 
	this.update = parseInt(this.store.selectSnapshot(LocalStorageState.updateType));
	if (this.swUpdate.isEnabled && this.update !== 2) {
	    navigator.serviceWorker.getRegistration().then(reg => {
		if(reg) {
		    reg.onupdatefound = ()=> this.handelUpdate() ;
		    //Проверка обновления на сервере
		    reg.update().then() ;
		}else console.log('Невозможно проверить обновление. Нет объекта регистрации.')
	    }) ;
	}
    }
    
    public reloadApp(popup){
	console.log('Перезагрузка приложения для активации обновления.');
	popup.active = false;
	this.manually = false;
	    //todo При перезагрузки страницы объект приложения удаляется, поэтому нет возможности сохранить
	// оповещение о примененном обновлении. Реализовать механихм сохранения уведомлений при перезагрузки приложения.
	//popup.desc.update === 1 && this.setAnnouncement(this.getPopup(0)) ;
	document.location.reload();
    }
    
    setPopup(version){
	
	let popup =  new PopupContext({
	    type : 3,
	    active : true,
	    text : 'Доступно обновление.',
	    contact : {photoURL : '/assets/app-shell/error_outline-24px.svg', imgColor : 'transparent', name : 'Версия : '+ version},
	    listener : ()=>{
	        this.reloadApp(popup);
	    },
	    extra : {timeout : false, icon : 'attention'}
	});
	this.appContext.setPopups({
	    add : true,
	    popup : popup
	});
    }
    
    public async handelUpdate(){
	
        let update = parseInt(this.store.selectSnapshot(LocalStorageState.updateType)),
	    popupAn = new PopupContext({
	    uid : uuid(),
	    type : 3,
	    date : Date.now(),
	    active : true,
	    listener : this.reloadApp.bind(this),
	    desc : { update : update },
	    text : update ? 'Доступно обновление.' : 'Обновление установлено.',
	    extra : {version : this.version}
	});
	
	if(update == 0) this.reloadApp(popupAn);
	if(this.manually) this.setPopup(this.version);
	else this.setAnnouncement(popupAn);

    }
    
    setAnnouncement(popupAn){
/*        this.appContext.announcements.next([popupAn].concat(this.appContext.announcements.value)) ;
	this.appContext.appChangeRef.markForCheck();*/
    }
    
    //Принудительная проверка новой версии на сервере
    public checkForUpdate(){
	navigator.serviceWorker.getRegistration().then(reg => {
	    console.log('Проверка обновления приложения.');
	    if(reg) {
	        this.manually = true;
	        //Проверка новой версии сервисного рабочего на сервере
		reg.update().then() ;
	    }
	    else console.log('Невозможно проверить обновление. Нет объекта регистрации.')
	});
    }
}

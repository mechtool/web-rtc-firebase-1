import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {AppContextState, LocalStorageState} from "../../../../store/states";
import {Observable} from "rxjs";
import {Contact, Offer, PopupContext} from "../../../../classes/Classes";
import {LocalizationService} from "../../../../services/localization.service";
import {ColorThemeService} from "../../../../services/color-theme.service";
import {Router} from "@angular/router";
import {contactSearch} from "../../../../animations/animations";
import {Actions} from "../../../../store/actions";
import ActivatedContactsAction = Actions.ActivatedContactsAction;
import {FormControl, Validators} from "@angular/forms";
import {WebRtcService} from "../../../../services/web-rtc.service";
import {uuid} from "uuidv4";
import {AppContextService} from "../../../../services/app-context.service";
import {FirebaseDatabaseService} from "../../../../services/firebase-database.service";

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css'],
    animations : [contactSearch],
})
export class NewMessageComponent implements OnDestroy{
    
    public textMessageControl = new FormControl('', [Validators.required]);
    @Select(AppContextState.contacts) public contacts$ : Observable<Contact[]> ;
    @Select(AppContextState.activatedContacts) public activatedContacts$ : Observable<Contact[]> ;
    
    public user = this.store.selectSnapshot(AppContextState.appUser);
    public subscriptions = [];
    public checkedContacts = [];
    public contactSearch = 'false';  //down
    public buttons =  [
	{icon : 'delete', tip : this.localizationService.getText(79), listener : this.deleteContact.bind(this), disabled : true},
	{icon : 'plus', tip: this.localizationService.getText(78), listener : this.searchContact.bind(this), disabled : false},
    ];
    public contactSearchContext = {type : +this.user.isAnonymous, mode : 'contacts', baseCollection : this.contacts$, targetCollection : this.activatedContacts$};
    public appUser = this.store.selectSnapshot(AppContextState.appUser);
    
    constructor(
        public appContext : AppContextService,
	public localizationService : LocalizationService,
	public colorService : ColorThemeService,
	public databaseService : FirebaseDatabaseService,
	public router : Router,
	public changeRef : ChangeDetectorRef,
	public colorThemeService : ColorThemeService,
	public webRtcService : WebRtcService,
	public store : Store) {
    }
    
    ngOnDestroy(): void {
	//При закрытии страницы - отчистить коллекцию пользователей
	this.subscriptions.forEach(sub => sub.unsubscribe());
	//Очистка коллекции активированных контактов
 	this.store.dispatch(new ActivatedContactsAction([]));
    }
    
    checkButtons(){
	this.buttons[0].disabled = !this.checkedContacts.length ;
	this.changeRef.markForCheck();
    }
    
    onSelectedItem(item){  //Подсветка строки при выборе контакта
	let activatedContacts = this.store.selectSnapshot(AppContextState.activatedContacts);
	for(let i = 0; i < this.checkedContacts.length; i++){
	    let el = this.checkedContacts[i];
	    if(el.uid == item.context.uid){
		this.checkedContacts.splice(i, 1);
		item.current.style.backgroundColor  =  this.colorThemeService.getNeededColor(activatedContacts.findIndex(c => c.uid === item.context.uid));
		this.checkButtons();
		return;
	    }
	}
	item.current.style.backgroundColor = this.colorThemeService.getThemeColor('light');
	this.checkedContacts.push(item.context);
	this.checkButtons();
    }
    
    searchContact(){
	this.contactSearch = this.contactSearch === 'false' ? 'true' : 'false';
    }
    
    deleteContact(){
	let activatedContacts = this.store.selectSnapshot(AppContextState.activatedContacts);
	this.store.dispatch(new ActivatedContactsAction(activatedContacts.filter(cont => {
	    return !this.checkedContacts.some(c => c.uid === cont.uid) ;
	}))).toPromise().then(() => {
	    this.checkedContacts = [];
	    this.checkButtons();
	});
    }
    
    startMessage(kind){
        let wid =  uuid(),
	    date = Date.now(),
	    webRtcContext = this.appContext.webRtcContexts.getContext(wid),
	    receivers = this.store.selectSnapshot(AppContextState.activatedContacts),
	    desc = {kind : kind, text : kind === 'text' ? this.textMessageControl.value : '', wid : wid,  uid : this.appUser.uid, sender : this.appUser, receivers : receivers};
        this.webRtcService.startWebRtc(desc).then(res => {
            //Формирование сообщение завершено.
	    //Записать факт формирования исходящего сообщения
	    //Отправка сообщений себе и всем пользователям, участвующим в соединениии.
	    //Это сообщение будет отображаться в интерфейсе приложения, на закладке сообщений
	   [this.appUser].concat(receivers).map((cont, inx) => {
		return {
		    type : inx === 0 ? 'outgoing': 'incoming',
		    path : '/messages/'+ cont.uid +'/'+ wid,
		    sender :  this.appUser ,
		    messId : uuid(),
		    receivers : receivers,
		    date : date,
		    wid : wid,
		    contact : cont,
		    actions : inx === 0 ? (()=> {
			let res = {};
			receivers.forEach(cont => {
			    res[cont.uid] = 'offered';
			});
			return res;
		    })() : {[cont.uid] : 'offered'},
		    metadata : inx === 0 ? ( JSON.parse(this.store.selectSnapshot(LocalStorageState.callSave)) ? {[this.appUser.uid] : {visual : {[Date.now()] : this.appContext.localVideoAudio}}} : {}) : {}}
	   }).forEach(m =>
		this.databaseService.sendMessage(m)
	   );
	    //Сообщения отправлены, нужно установить тайаут для проверки ответов удаленных пиров
	    //Установка таймаута ответа контакта:
	    //Для каждого явного предложения устанавливается таймаут, по прошествии которого проверяется
	    //состояние предложения по свойству action. Если оно denied/offered,
	    // тогда пользователю отображается уведомление на страницу уведомлений
	    //о том, что контакт прервал/проигнорировал вызов.
	    // НО ТОЛЬКО ОДИН POPUP ОТОБРАЖАЕТСЯ ПОЛЬЗОВАТЕЛЮ И ТОЛЬКО ДЛЯ ПОСЛЕДНЕГО
	    //ПРЕДЛОЖЕНИЯ, ЕСЛИ ВСЕ КОНТАКТЫ В ВЫЗОВЕ НЕ ПРИНЯЛИ СВОИХ ПРЕДЛОЖЕНИЙ
	    //Если свойство - offered, его значение меняется на ignored
	    webRtcContext.extra.timeout = setTimeout(()=>{
		let hasAccepted = false;
		if(webRtcContext.extra.timeout){
		    for(let key in webRtcContext.extra.actions){
			let text,
			    action = webRtcContext.extra.actions[key].action,
			    offer = webRtcContext.webRtcConnections[key].descriptor as Offer;
			if(/ignored|offered/.test(action)) {
			    //Изменить значение свойства action в дескрипторе
			    offer.status = 'ignored';
			    text = 'Вызов пропущен контактом.' ;
			    //Изменить значение свойства action на ignored в базе
			    this.databaseService.setDescriptorOptions({descriptor : offer, data : {action : 'ignored', active : false}});
			    //Пользователь  не принял предложение - записываем это в область входящих сообщений
			    this.databaseService.changeMessage('/messages/'+ offer.contact.uid +'/'+ offer.wid + '/actions' , {[offer.contact.uid] :offer.status}) ;
			    //Пользователь  не принял предложение - записываем это в область исходящих сообщений
			    this.databaseService.changeMessage('/messages/'+ offer.sender.uid +'/'+ offer.wid + '/actions' , {[offer.contact.uid] : offer.status}) ;
			}
			else if(/interrupted/.test(action)){
			    text = 'Вызов прерван инициатором.';
			    hasAccepted = true;
			    offer.status = 'interrupted';
			}
			else if(/denied/.test(action)) {
			    text = 'Вызов прерван контактом.';
			    offer.status = 'denied';
			}else if(/accepted/.test(action)) {
			    //Вызов принят
			    hasAccepted = true;
			    text = 'Вызов принят контактом' ;
			    offer.status = 'accepted';
			}
		
			//Установка уведомление для страницы уведомлений
			this.webRtcService.setAnnouncement(new PopupContext({
			    desc : offer,
			    text : text,
			    type : 2,
			    active : true,
			    contact : this.appContext.searchMessageContacts([offer.contact])[0]
			}));
			//Обновление интерфейса
			this.changeRef.markForCheck();
		    }
		    //Отчистка таймаута
		    clearTimeout(webRtcContext.extra.timeout);
		    webRtcContext.extra.timeout = undefined;
	    
		    if(!hasAccepted) {
			//Отправить оповещение пользователю о том, что ни один из контактов не
			//отвелил. Вызов оказался не принятым.
			this.appContext.setPopups({
			    add: true, popup: new PopupContext({
				type: 2,
				active: true,
				text: 'Контакты не ответили',
				contact: {photoURL: '/assets/app-shell/error_outline-24px.svg', imgColor: 'transparent', name: 'Вызов завершен.'},
				listener: () => {
				    //Запуск функции завершения вызова видеосообщения
				    this.webRtcService.stopVideoChannel(webRtcContext.messageCollection[0]);
				},
				extra: {timeout: true, icon: 'attention'}
			    })
			}) ;
			//Снятие индикации вызова соединения
			webRtcContext.messageCollection.filter(video => video.local)[0].className.pulse = false;
			//Обновление интерфейса
			this.changeRef.markForCheck();
		    }
		}
	
	    }, parseInt(this.store.selectSnapshot(LocalStorageState.callTime)));
	   
	});
    }
}

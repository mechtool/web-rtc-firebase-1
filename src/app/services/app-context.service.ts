import {Injectable} from '@angular/core';
import { Store} from "@ngxs/store";
import { Router} from "@angular/router";
import {PopupContext, WebRtcContexts} from "../classes/Classes";
import {AppContextState, LocalStorageState} from "../store/states";
import {Actions} from "../store/actions";
import PopupsAction = Actions.PopupsAction;

@Injectable({
  providedIn: 'root'
})
export class AppContextService {
    //Верификатор рекапчи
    public recaptchaVerifier;
    //Объект подтверждения при аутентификации
    public confirmation;
    //Главный контекст webRtc
    public webRtcContexts : WebRtcContexts = new WebRtcContexts();
    //Настройки только локального контекста для передачи удаленным контекстам
    public localVideoAudio = {type : 'settings', video : 1, audio : 1};
    //Режимы обновления приложения
    public updateType = [{text : 'Проверять и обновлять'}, {text : 'Проверять'}, {text : 'Не проверять'}];
    //Все аапаратные средства
    public hardware = this.store.selectSnapshot(AppContextState.hardware);
    
    constructor(
      public store : Store,
      private _router : Router) {
        this.setReuseStrategy();
    }
    
    searchMessageContacts(receivers){
	//Функция ищет и возвращает контакты пользователя по контактам, полученными из дескриптора .
	//Если в контактах пользователя нет контакта, пришедшего в дескрипторе, в коллекции активных контактах
	//устанавливается контакт из дескриптора
	return receivers.map(cont => {
	    let ct = this.store.selectSnapshot(AppContextState.contacts).find(ct => ct.uid === cont.uid);
	    return ct ? ct : cont;
	});
    }
    
    getConstraints(){
         return {
	     audio: {deviceId: this.hardware.find(hard => hard.text === this.store.selectSnapshot(LocalStorageState.audioHardware)).deviceId  , echoCancellation : true, autoGainControl : true, noiseSuppression: true},
	     video: {deviceId: this.hardware.find(hard => hard.text === this.store.selectSnapshot(LocalStorageState.videoHardware)).deviceId }
	 };
    }
    
    setPopups(option : {add : boolean , popup : PopupContext, index? : number}){
	//true - добавить, false - удалить по индексу
	//При установке оповещений нужно контролировать количество в коллекции, и если больше определенного
	//значения (5), то удалять элементы коллекции С КОНЦА
	let popups =  this.store.selectSnapshot(AppContextState.popups);
	option.add ? popups.unshift(option.popup) : popups.splice(option.index, 1) ;
	this.store.dispatch(new PopupsAction(popups.filter((popup, inx) => inx < 5)));
    }
    
    getState(outlet){
	return outlet.activatedRouteData.type;
    }
    setReuseStrategy() {
        //Реализация стратегии повторной перезагрузки компонентов при активации загруженных маршрутов
//	this._router.routeReuseStrategy.shouldReuseRoute = () => false;
	this._router.onSameUrlNavigation = 'reload';
    }
    clearRecaptcha(){
	if(this.recaptchaVerifier && this.recaptchaVerifier.clear) {
	    this.recaptchaVerifier.clear();
	    this.recaptchaVerifier = undefined;
	}
    }

    
}

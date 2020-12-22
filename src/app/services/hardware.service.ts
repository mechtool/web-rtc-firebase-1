import {Inject, Injectable} from '@angular/core';
import {Store} from "@ngxs/store";
import {Actions} from "../store/actions";
import HardwareAction = Actions.HardwareAction;
import HardwareStatusAction = Actions.HardwareStatusAction;
import { LocalizationService } from './localization.service';
import {NAVIGATOR} from "../classes/Globals";

@Injectable({
  providedIn: 'root'
})
export class HardwareService {

  constructor(
	public localizationService : LocalizationService,
	@Inject(NAVIGATOR) public navigator : Navigator,
	private store : Store) {
      //Обработчик изменения статуса аппараиных средств
      this.navigator.mediaDevices.ondevicechange = (event)=> {
	  this.enumerateDevices();
      }
      this.enumerateDevices();
  }
  

enumerateDevices(){
	//Функция получает все устройства ввода/вывода и формирует набор доступных аппаратных средств приложения
	//получаем все устройства ввода/вывода в os
	let deviceText = ['videoinput', 'audioinput', 'audiooutput'];
	this.navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
	    let devices = [];
	    //получаем все устройства/фильтруем повторяющиеся по маркеру
	    deviceInfos.map(dev => {
		return  {
		    text : dev.kind === 'videoinput' ? 'Camera' : dev.kind === 'audioinput' ? 'Microphone' : dev.kind === 'audiooutput' ? 'Output' : 0,
		    kind : dev.kind.trim(),
		    deviceId : dev.deviceId.trim(),
		    groupId : dev.groupId.trim()
		}}).filter((dev, inx) => {devices.some(d => {
		//Фильтрация повторяющихся наименований
		return d.kind === dev.kind && d.groupId === dev.groupId; //false;
	    }) || setDevices(devices, dev);
	    }) ;
	    this.store.dispatch(new HardwareAction(devices));
	    this.store.dispatch(new HardwareStatusAction(setHardwareStatus(devices)));
	}).catch(err => {});
	
	function setHardwareStatus(devices) {
	    let result = [];
	    deviceText.forEach(kind => {
	        if(!devices.some(el => el.kind === kind)){
	            result.push(kind)
	    }});
	    return {state : !result.length, result};
	}
	
	function setDevices(devices, dev){
	    dev.text = `${dev.text} ${devices.filter(d => d.kind === dev.kind).length}`;
	    devices.push(dev)
	}
    }
}

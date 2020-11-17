import {Component, Input, OnInit} from '@angular/core';
import {PopupContext} from "../../../Classes/Classes";
import {AppContextService} from "../../../services/app-context.service";
import {Store} from "@ngxs/store";
import {AppContextState} from "../../../store/states";

@Component({
  selector: 'app-popup-notifications',
  templateUrl: './popup-notifications.component.html',
  styleUrls: ['./popup-notifications.component.css'],
})
export class PopupNotificationsComponent implements OnInit {

    public appChangeDetector = this.store.selectSnapshot(AppContextState.changeDetector);
    public popups = this.store.selectSnapshot(AppContextState.popups);
    @Input() public context : PopupContext;
    
  constructor(
      public store : Store,
      public appContext : AppContextService) { }

  ngOnInit() {

  }
   
   onInit(context){
       //Запуск таймера удаления уведомления, на случай, если пользователь оставит его без внимание,
       //оно должно быть удалено авоматически.
       if(context.extra && context.extra.timeout) {
	   context.extra.timeId = window.setTimeout(()=>{
	       this.onCancel(context);
	   }, context.extra.callTime);//диапазон отображения диалогов
       }
   }
  
    onCancel(context){
	//Снятие активности контекста
	context.active = false;
	context.extra.timeId && window.clearTimeout(context.extra.timeId);
	context.listener && context.listener();
	//Поиск индекса контекста в коллекции входящих вызовов
	let index = this.popups.findIndex(incoming => incoming.uid === context.uid);
	//Удаление входящего вызова из коллекции для удалении его с экрана пользователя
	if(index > -1){
	    this.appContext.setPopups({add : false, popup : undefined, index : index});
	}
	//Обновление интерфейса
	this.appChangeDetector.detectChanges();
    }

}

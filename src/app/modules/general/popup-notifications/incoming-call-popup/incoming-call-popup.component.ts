import {Component, Input, OnInit} from '@angular/core';
import {IncomingPopupContext, PopupContext} from "../../../../Classes/Classes";
import {AppContextService} from "../../../../services/app-context.service";
import {FirebaseDatabaseService} from "../../../../services/firebase-database.service";
import {PopupNotificationsComponent} from "../popup-notifications.component";
import {Store} from "@ngxs/store";
import {AppContextState, LocalStorageState} from "../../../../store/states";

@Component({
  selector: 'app-incoming-call-popup',
  templateUrl: './incoming-call-popup.component.html',
  styleUrls: ['./incoming-call-popup.component.css']
})
export class IncomingCallPopupComponent implements OnInit {
    
    @Input() public context : IncomingPopupContext;
    public appUser = this.store.selectSnapshot(AppContextState.appUser);
    public buttons = [
	{tip : 'Принять', icon : 'check_circle', color : '#00902e', listener : ()=> {
		this.onCancel('accepted');
	    }},
	{tip : 'Отклонить', icon : 'highlight_off', color : '#c02500', listener : ($event)=> {
		this.onCancel('denied');
	    }}
    ];
    constructor(
	public appContext : AppContextService,
	public database : FirebaseDatabaseService,
	public store : Store,
	public popupComponent : PopupNotificationsComponent,
    ) {}
    
    removeTimeOut(){
	if(this.context.extra && this.context.extra.timeout){
	    window.clearTimeout(this.context.extra.timeId);
	    this.context.extra.timeId = false;
	}
    }
    onCancel(action){
        //Удаление обработчика, если признаки отказа
	if(/denied|ignored/.test(action)){
	    this.context.listener = undefined;
	    //Пользователь только неявного предложения его не принял  - записываем это в область входящих сообщений
	    // Явный прием сообщения передается ТОЛЬКО после проверки на возможность отправляющей стороны завершить сообщение ДО поднятие трубки принимающей стороной
	    this.database.changeMessage('/messages/'+ this.appUser.uid +'/'+ this.context.desc.wid + '/actions',{[this.appUser.uid ]: action}) ;
	    //Снятие признака активности предложения в базе данных
	    if(this.context.desc) {
	        this.database.setDescriptorOptions({descriptor : this.context.desc, data : {active : false,  action : action}}).then(res => {
	            //todo Закоментировано (временно) по причине не глубокой продуманности логического потока.
		    // Этот функционал дублируется с функционалом вызывающей стороны метод сервиса wed-rtc.service stopVideoChannel(videoContext);
	            //Удаление дескриптора из базы данных
/*		    this.database.database.ref(`web-rtc/${this.context.desc.type}/${this.context.desc.contact.uid}/${this.context.desc.messId}`).remove().then(()=> {
			//Удаление кандидатов
			this.database.database.ref('/web-rtc/candidates/' + this.appUser.uid).orderByChild('descId').equalTo(this.context.desc.messId).once('value').then(res => {
			    res.forEach(item => {item.ref.remove()}) ;
			
			})
		    });*/
		})
	    }
	}
	this.removeTimeOut();
	this.popupComponent.onCancel(this.context);
    }
    
    ngOnInit() {
	//Запуск таймера удаления уведомления, на случай, если пользователь оставит его без внимание,
	//оно должно быть удалено авоматически.
	if(this.context.extra && this.context.extra.timeout) {
	    this.context.extra['timeId'] = window.setTimeout(()=>{
		this.onCancel('ignored');
	    }, this.context.extra.callTime - 10);//диапазон отображения диалогов
	}  }
}

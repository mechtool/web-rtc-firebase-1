import {Component, Input, OnInit} from '@angular/core';
import {PopupContext} from "../../../../Classes/Classes";
import {AppContextService} from "../../../../services/app-context.service";
import {FirebaseDatabaseService} from "../../../../services/firebase-database.service";
import {PopupNotificationsComponent} from "../popup-notifications.component";

@Component({
  selector: 'app-no-answer-popup',
  templateUrl: './no-answer-popup.component.html',
  styleUrls: ['./no-answer-popup.component.css']
})
export class NoAnswerPopupComponent implements OnInit {
    
    public contactName;
    @Input() public context : PopupContext;
    buttons = [
	{tip : 'Ok', icon : 'check_circle', color : '#00902e', listener : ()=> {
		this.popupComponent.onCancel(this.context);
	    }}
    ];
    constructor(
	public appContext : AppContextService,
	public database : FirebaseDatabaseService,
	public popupComponent : PopupNotificationsComponent) { }
    
	
    onErrorContactImg(event){
	this.database.onErrorContactImg(event, this.context).then(res => {
	    console.log('Запрос изображения контакта.')
	}) ;
	return true;
    }
    
    ngOnInit(): void {
	this.contactName = this.context.contact.userName || this.context.contact.displayName || this.context.contact.phoneNumber || this.context.contact.email;
	this.popupComponent.onInit(this.context);
    }
}

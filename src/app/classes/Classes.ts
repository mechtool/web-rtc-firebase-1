import {ColorThemeService} from '../services/color-theme.service'
import { v4 as uuid } from 'uuid'

export class Contact{
    uid : string;
    photoUrl : string;
    displayName : string;
    secondName : string;
    thirdName : string;
    userName : string;email : string;
    phoneNumber : string;
    backColor : string;
    indicator : string;
    note : string;
    
    constructor(prop) {
        this.uid = prop.uid || uuid();
        this.displayName = prop.displayName || '';
        this.userName = prop.userName || '';
        this.email = prop.email || '';
        this.phoneNumber = prop.phoneNumber || '';
        this.photoUrl = prop.photoUrl || '/assets/icons/user.svg';
        this.backColor = prop.backColor ||  ColorThemeService.colorBase[1].backgroundColor;
        this.indicator = prop.indicator || '';
        this.note = prop.note || '';
        this.secondName = prop.secondName || '';
        this.thirdName = prop.thirdName || '';
    }
}
//Определение класса внутренних оповещений пользователя - элемент страницы Announcements
export class Announcement{

}
//Определение класса сообщения пользователя - отдельный класс, ассоциирующий вызовы контактов
export class Message{
   public type : string;
}
export class UserContact{
    //идентификатор владельца контакта
    uid : string;
    contact : Contact;
    
    constructor(prop) {
        this.uid = prop.uid || uuid();
        this.contact = prop.contact;
    }
}

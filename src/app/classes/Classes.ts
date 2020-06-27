import {ColorThemeService} from '../services/color-theme.service'
import { v4 as uuid } from 'uuid'

export class Contact{
    _id : string;
    imgUrl : string;
    imgFile : any;
    name : string;
    secondName : string;
    thirdName : string;
    userName : string;
    password : string;
    email : string;
    phone : string;
    backColor : string;
    indicator : string;
    note : string;
    
    constructor(prop) {
        this._id = prop._id || uuid();
        this.name = prop.name || '';
        this.userName = prop.userName || '';
        this.password = prop.password || '';
        this.email = prop.email || '';
        this.phone = prop.phone || '';
        this.imgUrl = prop.imgUrl || '/assets/icons/user.svg';
        this.backColor = prop.backColor ||  ColorThemeService.colorBase[1].backgroundColor;
        this.indicator = prop.indicator || '';
        this.note = prop.note || '';
        this.secondName = prop.secondName || '';
        this.thirdName = prop.thirdName || '';
        this.imgFile = prop.imgFile || '';
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
    _id : string;
    //идентификатор владельца контакта
    uid : string;
    contact : Contact;
    
    constructor(prop) {
        this._id  =  prop._id || uuid();
        this.uid = prop.uid || uuid();
        this.contact = prop.contact;
    }
}

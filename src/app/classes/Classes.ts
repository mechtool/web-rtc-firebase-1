import {ColorThemeService} from '../services/color-theme.service';
import { v4 as uuid } from 'uuid';
import {BehaviorSubject} from "rxjs";

export const STATES = [
    {class : 'en', code : '+1', src : '/assets/flags-24/002-flag.png', alt : 'Флаг Америки'},
    {class : 'arm', code : '+374', src : '/assets/flags-24/007-armenia.png', alt : 'Флаг Армении'},
    {class : 'ru', code : '+7', src : '/assets/flags-24/001-russia.png', alt : 'Флаг России'},
    {class : 'kz', code : '+7', src : '/assets/flags-24/006-kazakhstan.png', alt : 'Флаг Казахстана'},
    {class : 'geo', code : '+995', src : '/assets/flags-24/009-georgia.png' , alt : 'Флаг Грузии'},
    {class : 'de', code : '+49', src : '/assets/flags-24/004-germany.png', alt : 'Флаг Германии'},
    {class : 'uk', code : '+380', src : '/assets/flags-24/003-ukraine.png', alt : 'Флаг Украины'},
    {class : 'bel', code : '+375', src : '/assets/flags-24/005-belarus.png', alt : 'Флаг Беларуссии'},
    {class : 'est' , code : '+372', src : '/assets/flags-24/008-estonia.png', alt : 'Флаг Эстонии'},
] ;

export class User{
    uid : string;
    photoURL : string;
    userName : string;
    email : string;
    phoneNumber : string;
    phoneCode : string;
    messToken : any;
    isAnonymous : boolean;
    
    constructor(prop) {
	this.uid = prop.uid || uuid();
	this.userName = prop.userName || '';
	this.email = prop.email || '';
	this.messToken = prop.messToken || '';
	this.photoURL = prop.photoURL || '/assets/icons/user.svg';
	this.isAnonymous = prop.isAnonymous;
	
	this.setPhone(prop.phoneNumber)
    }
    
    setPhone(phoneNumber){
	this.phoneCode = phoneNumber ? phoneNumber.substring(0, (phoneNumber.length - 10)) : '';
	this.phoneNumber = phoneNumber ?  phoneNumber.substring((phoneNumber.length - 10)) : '';
    }
}

export class Contact extends User{
    
    backColor : string;
    indicator : string;
    note : string;
    displayName : string;
    secondName : string;
    thirdName : string;
    smsAccount : {currency : string, sum : number} ;
    
    constructor(prop) {
        super(prop);
	this.displayName = prop.displayName || this.isAnonymous ? 'Anonymous' : '';
	this.secondName = prop.secondName || '';
	this.thirdName = prop.thirdName || '';
        this.backColor = prop.backColor ||  ColorThemeService.colorBase[1].backgroundColor;
        this.indicator = prop.indicator || '';
        this.note = prop.note || '';
        this.smsAccount = prop.smsAccount || {currency : '', sum : 0} ;
    }
}
//Определение класса внутренних оповещений пользователя - элемент страницы Announcements
export class Announcement{

}
//
export class Message{
    public type : string;// outgoing/incoming
    public active : boolean;
    public path : string;
    public sender : Contact;
    public messId : string;
    public receivers : Contact[];
    public date : number;
    public wid : string;
    public actions : string
    public metadata : any;
    
}

//-------descriptor / offer/ answer / candidate
export class Descriptor {
    
    contact : Contact; //Получатель дескриптора
    messId : string;//Уникальный идентификатор дескриптора
    wid : string; //Идентификатор вызова webRtc
    receivers? : Contact[]; //идентификаторы получателей
    sender : Contact; //отправитель
    date : number; //дата сообщения milliseconds
    desc : any; //сам дескриптор
    type : string; //offers / answers / candidates
    mode : string; //{type :video/text , text : Если сообщение текстовое, это свойство содержит текст из поля ввода инициатора сообщения }
    active : boolean ; //Признак активности
    optimize : string = '0';
    uid : string;
    extra : any;
    
    constructor(desc){
	
	this.contact = desc.contact; //Получатель дескриптора
	this.wid = desc.wid;
	this.receivers = desc.receivers || [];//идентификаторы получателей
	this.sender = desc.sender; //ссылка отправителя
	this.date = Date.now(); //дата сообщения milliseconds
	this.desc  = desc.desc; //дескриптор
	this.type = desc.type; //offer / answer / candidate
	this.messId = desc.messId || uuid();// идентификатор дескриптора
	this.active = desc.active || true;
	this.optimize = desc.optimize ;
	this.uid = desc.uid;
	this.extra = this.extra || '';
    }
}

export class Candidate extends Descriptor{
    //Идентификатор предложения или ответа для которого собирается кандидат
    public descId : string;
    constructor(candidate){
	super(candidate);
	this.descId = candidate.descId;
    }
}

export class Offer extends Descriptor{
    
    public candidates ? ;
    public stun : string;
    public status : string;
    public descId : string;
    public messageUrl : string ;
    public kind : string;
    
    constructor(offer){
	super(offer) ;
	this.candidates = offer.candidates;
	this.type = offer.type || '' ;   //explicit/implicit
	this.kind = offer.kind || 'text' ;  //text/video
	this.stun = offer.stun || '';
	this.descId = offer.descId;
	this.messageUrl = offer.messageUrl || '';
	this.status = offer.status || 'offered'; //denied-отказано /ignored- не принято/offered- предложено/accepted - принят
    }
}

export class Answer extends Descriptor{
    
    public candidates ? ;
    //Идентификатор предложения на котрый сформирован ответ
    public descId : string;
    
    constructor(answer){
	super(answer) ;
	this.candidates = answer.candidates ? answer.candidates : false;
	this.descId = answer.descId;
    }
}

export class PopupContext{
    
    public uid : string;
    public type : number;
    public date ? : number;
    public listener : Function;
    public active : boolean;
    public desc : any;
    public contact :Contact;
    public text : string;
    public extra : any;
    
    constructor(options){
	this.uid = options.uid || uuid();
	this.type = options.type;
	this.listener = options.listener || undefined;
	this.date = options.date || Date.now();
	this.active = options.active || false;
	this.desc = options.desc;
	this.contact = options.contact || new Contact({name : 'Unknown'});
	this.text = options.text || '';
	this.extra = options.extra || {timeout : false};
    }
}
//Оповещение о входящем вызове. В параметр передается явное предложение
export class IncomingPopupContext extends PopupContext{
    
    public desc : Offer;
    
    constructor(props) {
	super(props);
	this.desc = props.desc;
    }
}
//Уведомление на страницу уведомлений
export class  AnnouncementContext extends PopupContext{
    
    public content? : string;
    
    constructor(props) {
	super(props);
	this.content = props.content || '';
    }
}
//----------------web-rtc---------------------

export class WebRtcConnectionContext{
    public uid : string;
    public pcConnection : any ;
    public messageContext : MessageContext;
    public descriptor : Answer | Offer;
    public candidates : any[];
    public webRtcContext : WebRtcContext;
    
    constructor(options){
	this.uid  = options.uid;
	this.pcConnection = options.pcConnection || undefined;
	this.messageContext  = options.messageContext || undefined;
	this.descriptor = options.descriptor || undefined;
	this.candidates = options.candidates || [];
	this.webRtcContext = options.webRtcContext || undefined;
    }
}

//Корневой (главный) объект всех контекстов PeerConnections. Содержит набор  контекстов соединений.
export class WebRtcContexts{
    //Идентификатор активного контекста
    public activeContextId;
    //Набор контектов входящих в соединение
    public contexts : BehaviorSubject<WebRtcContext[]> = new BehaviorSubject([]);
    //Метд получения объекта контекста по его уникальному идентификатору
    getContext(wid : string) : WebRtcContext{
	return this.contexts.value.find(context => context.wid === wid);
    }
    //Метод добавление контекста соединения в набор контекстов
    addContext(context : WebRtcContext){
	let contexts = this.contexts.value ;
	contexts.push(context);
	this.contexts.next(contexts);
	return context;
    }
    //Метод удаления контекста соединения из набора контекстов
    deleteContext(wid : string){
	let contexts =  this.contexts.value,
	    index =  contexts.findIndex(cont => cont.wid === wid);
	if(index > -1){
	    contexts.splice(index, 1) ;
	    this.contexts.next(contexts);
	}
    }
    //Метод удаления всех имеющихся контекстов в наборе
    deleteAllContexts(){
	this.contexts = new BehaviorSubject([]);
    }
}

export class WebRtcContext{
    //Уникальный идентификатор контекста PeerConnection
    public wid? : string;
    //Идентификатор инициатора создания соединения
    public uid : string;
    //Ссылка на отправителя дескриптора
    public sender ? : Contact;
    //Основной дескриптор текущего контекста
    public desc ? : any;
    //Ссылка на общую коллекцию контекстов PeerConnection
    public webRtcConnections ? : {[key : string] : WebRtcConnectionContext};
    //Набор получателей дескриптора
    public receivers ? : BehaviorSubject<any[]>;
    //Коллекция видеоконтекстов всех пиров, участвующих в соединении
    public messageCollection ? : MessageContext[];
    //Локальный поток для установки его в peerConnection
    public localStream ? : any;
    //Дополнительные произвольные данные, необходимые для передачи соединению
    public extra ? : {actions : any, timeout : any};
    
    constructor(options){
	
	this.wid = options.wid || uuid();
	this.receivers = options.receivers || new BehaviorSubject([]);
	this.messageCollection =  options.messageCollection || [];
	this.uid = options.uid;
	this.sender = options.sender;
	this.desc = options.desc || undefined;
	this.webRtcConnections = {};
	this.localStream = options.localStream || undefined;
	this.extra = options.extra || {actions : {}, timeout : undefined};
    }
}

export class MessageContext{
    //Идентификатор контекста соединения к которому пренадлежит данный видеоконтекст
    public wid : string;
    //Контакт, который обслуживает данный видеоконтекст
    public contact : BehaviorSubject<Contact>;
    public stream : BehaviorSubject<any>;
    public channelClass : string;
    public className? : any;
    public local : boolean ;
    public dataChannel : any;
    public settings : any;
    public videoElement  : any;
    public  messageUrl : string;
    
    constructor(options){
	this.wid = options.wid;
	this.contact = options.contact || new BehaviorSubject(new Contact({name : 'Unknown'}));
	this.stream = options.stream || new BehaviorSubject(null);
	this.channelClass = options.channelClass;
	this.className = options.className;
	this.local = options.local || false;
	this.dataChannel = options.dataChannel || undefined;
	this. messageUrl = options. messageUrl || '' ;
	this.settings = options.settings || {type : 'settings', video : 1, audio : 1};
    }
}

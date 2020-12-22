import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {FirebaseDatabaseService} from "./firebase-database.service";
import {Store} from "@ngxs/store";
import {AppContextState, LocalStorageState} from "../store/states";
import {
    Answer,
    Candidate,
    IncomingPopupContext,
    MessageContext,
    Offer,
    PopupContext,
    WebRtcConnectionContext,
    WebRtcContext
} from "../classes/Classes";
import {BehaviorSubject, Subject} from "rxjs";
import {AppContextService} from "./app-context.service";
import {Router} from "@angular/router";
import {StatusColorsService} from "./status-colors.service";
import {FirebaseMessagingService} from "./firebase-messaging.service";
import {SmsService} from "./sms.service";
import {Actions} from "../store/actions";
import AnnouncementsAction = Actions.AnnouncementsAction;
import {v4 as uuid} from 'uuid';
declare var SimplePeer: import('simple-peer').SimplePeer;

@Injectable({
  providedIn: 'root'
})
export class WebRtcService implements OnDestroy{
    
    public collections = [{ first : '/web-rtc/offers/explicit/'}];
    public messageRoutes = {text : '/application/text-message', video : '/application/video-message'};
    public appUser  = this.store.selectSnapshot(AppContextState.appUser);
    public appChangeDetector = this.store.selectSnapshot(AppContextState.changeDetector);
    public announcements = this.store.selectSnapshot(AppContextState.announcements);
    public videoAudioDefault = {type : 'settings', video : 1, audio : 1};
    //Адреса пиров, которым посылаем явные предложения, для того, что бы при завершении вызова снять обработчики событий
    public offerChangedUrls = [];
    
    constructor(
        public store : Store,
	public router : Router,
	public statusColorService : StatusColorsService,
	public appContext : AppContextService,
	public ngZone : NgZone,
	public smsService : SmsService,
	public firebaseMessagingService : FirebaseMessagingService,
	public databaseService : FirebaseDatabaseService ) {
      this.initialize();
  }
  
  ngOnDestroy() {
         this.stopOfferContactListeners();
  }
    
    initialize() {
      //Если пользователь анонимный, тогда связаться с ним можно только по средствам sms
      //Если пользователь вошел по ссылке в sms, то он может подписаться на входящие вызовы
      if (!this.appUser.isAnonymous) {
	  this.collections.forEach(element => {
	      this.databaseService.database.ref(element.first + this.appUser.uid).orderByChild("action").equalTo('offered').on('child_added', (snap) => this.setPopup(snap.val()));
	  })
  	}
  }
  async startWebRtc(descriptor) {
      //todo Удалить имеющийся вызов перед инициализацией нового
      //todo Задача: Перед самым запуском нового контекста webRtc, для не инициатора возникает необходимость
      // проверки полученного дескриптора на возможность отмены вызова инициатором. Для этого необходимо получить статус активности
      // дескриптора инициатора
      let that = this,
	  localStream = await navigator.mediaDevices.getUserMedia(this.appContext.getConstraints());
      if (descriptor.desc) {
	  this.databaseService.database.ref(`/web-rtc/${descriptor.type}/${this.appUser.uid}/${descriptor.messId}/action`).once('value').then(actionSnap => {
		  let val = actionSnap.val();
		  if(val && /offered/.test(val)) startContext() ;
		  else interruptConnection();
	      }
	  )} else startContext();
      
      //Создание нового контекста сообщения
	function startContext(){
	    //Остановить имеющийся контекст, если он сужествует
	    checkContext();
	    //Создается новый контекст WebRtc
	    let webRtcContext = new WebRtcContext({
		wid  : descriptor.wid,
		uid : descriptor.uid,
		desc : descriptor,
		sender : descriptor.sender,
		receivers : new BehaviorSubject(descriptor.receivers),
		localStream : localStream,
	    });
	    //Добавление контекста в коллекцию контекстов
	    //Установка идентификатора активного контекста
	    that.appContext.webRtcContexts.activeContextId = that.appContext.webRtcContexts.addContext(webRtcContext).wid;
	    //Запуск соединений по коллекции контактов
	    that.startConnections();
	    //Запускаем компонент web-rtc (video/text)
	    that.router.navigateByUrl(that.messageRoutes[descriptor.kind]);
	}
	
	function checkContext(){
	    
        }
	
	function interruptConnection(){
	    //Соединение прервано инициатором - выдать предупреждение пользователю и закрыть соединение
	}
    }
    
    async startConnections(desc?){
	
	let webRtcContext = this.appContext.webRtcContexts.getContext(this.appContext.webRtcContexts.activeContextId);
	if(!webRtcContext) return ;
	let sender = desc ? desc.sender : webRtcContext.sender,
	    stunTurn = this.store.selectSnapshot(LocalStorageState.stunTurn),
	    optimizeCall = JSON.parse(this.store.selectSnapshot(LocalStorageState.optimizeCall)),
	    receivers = webRtcContext.receivers.value,
	    messageContacts = desc ? [sender] : [sender].concat(receivers);
	if(messageContacts){
	    //Находим индекс локального пользователя
	    let localIndex = messageContacts.findIndex(contact => contact.uid === this.appUser.uid);
	    //Запуск всех потоков для каждого контакта
	    messageContacts.forEach((contact, contactIndex)=> {
		let webRtcConnectionContext : WebRtcConnectionContext ,
		    //Признак обработки локального пользователя
		    local = this.appUser.uid === contact.uid,
		    //Признак инициатора создания сообщения
		    initiator = desc ? false : ((webRtcContext.uid === this.appUser.uid ) || localIndex < contactIndex);
		//Блок условия формирования объекта видеоконтекста, который связан с шаблоном представления, отображающего данные этого контекста
		//Если индекс локального пользователя меньше или равен индексу текущего пользователя
		//Или если локальный пользователь НЕ является инициатором и индекс текущего контакта равен 0
		if(localIndex <= contactIndex || (!initiator && contactIndex == 0)) {
		    webRtcConnectionContext = webRtcContext.webRtcConnections[contact.uid] = new WebRtcConnectionContext({uid: contact.uid});
		    webRtcConnectionContext.webRtcContext = webRtcContext;
		    webRtcConnectionContext.uid = contact.uid;
		    //Видеоконтекст для каждого контакта
		    webRtcConnectionContext.messageContext = new MessageContext({
			wid: webRtcContext.wid,
			contact: new BehaviorSubject(local ? this.appUser : contact),
			channelClass : local ? 'local' : "remote",
			messageUrl : webRtcContext.desc.messageUrl,
			className: local ? {
			    [contact.uid + ' local video-context']: true,
			    active: false,//Класс активного видеоконтекста, когда он транслирует видеосигнал
			    fixed: false, //Класс фиксированного видеоконтекста, когда видеоэлемент находится внизу слева
			    closed : false, //Класс закрытого видеоконтекста, когда соединение с удаленным пиром закрыто
			    pulse: initiator, //Класс запуска пульсирующей индикации вызова
			} : {[contact.uid + ' remote video-context']: true, active: false},
			stream: new BehaviorSubject(local ? webRtcContext.localStream : undefined),
			local: local,
			settings: {type: 'settings', video: 1, audio: 1},
			dataChannel: {data: new Subject(), channel: undefined},
		    });
		    local && webRtcContext.messageCollection.push(webRtcConnectionContext.messageContext);
		}
		//Если выполняется не локальный пользователь или индекс локального пользователя меньше индекса текущего
		if(localIndex < contactIndex || (!initiator && contactIndex == 0)) {
		    //Запуск соединения
		    webRtcConnectionContext.pcConnection = new SimplePeer({
			//контакт имеет индекс больше индекса локального пользователя в коллекции контактов или обрабатывается инициатор вызова, тогда ставиться признак инициатора для генерирования предложения
			initiator : initiator,
			channelName : contact.uid,
			//Если соединение формируется для явного предложения, тогда свойство берется из настроек, иначе - из явного предложения
			config : this.store.selectSnapshot(AppContextState.stunTurnConfig)[ initiator ? this.store.selectSnapshot(LocalStorageState.stunTurn) : webRtcContext.desc.stun ],
			stream : webRtcContext.localStream,
		    });
		    //Функция, вызываемая при выдачи библиотекой сервисных сообщений или ошибок. В ее парамет будет передаваться объект ошибки
		    webRtcConnectionContext.pcConnection._debug = console.log ;
		    //Установка ссылки на функцию отправки сообщений, чтобы контекст мог их отправлять, если пользователь инициатор сообщения
		    //Неинициатор устанавливает свой канал связи в событии connect()
		    initiator && (webRtcConnectionContext.messageContext.dataChannel.channel = webRtcConnectionContext.pcConnection._channel);
		    //Вызывается при генерации предложений, ответов, кандидатов
		    webRtcConnectionContext.pcConnection.on('signal', async (data)=> {
			//Проанализировать настройку оптимизации соединения,
			//предложение или ответ ждет формирование кандидатов и отправляются на сервер в одной упаковке
			let explicit = webRtcContext.uid === this.appUser.uid;
			if(data.type){
			    if(data.type === 'offer') {
				webRtcConnectionContext.descriptor = new Offer({
				    //тип предложения (явное или не явное)
				    type: (explicit ? 'offers/explicit' : 'offers/implicit'),
				    //вид предложения (text/video)
				    kind : webRtcContext.desc.kind ,
				    //статус текущего предложения
				    status : 'offered',
				    //Контакт, которому предназначено предложение
				    contact: contact,
				    //Идентификатор пользователя-отправителя предложения
				    uid: this.appUser.uid,
				    //Идентификатор контекста web-rtc, к которому принадлежит предложение
				    wid: webRtcContext.wid,
				    //Сслылка на сообщение, куда будет записан файл сообщения
				    messageUrl : (explicit ? '/messages/'+ contact.uid +'/'+ webRtcContext.wid : ''),
				    //Коллекция контактов-участников сообщения
				    receivers: initiator ? webRtcContext.receivers.value : [contact],
				    //Контакт-отправитель предложения
				    sender: this.appUser,
				    //Режим конфигурации STUN/TURN
				    stun: initiator ? stunTurn : webRtcContext.desc.stun,
				    //Сгенерированный библиотекой объект данных, непосредственно содержащий предложение
				    desc: data,
				    //Уникальный идентификатор объекта предложения, сформированный из двух идентификаторов (идентификатора контекста и идентификатора пользователя - инициатора предложения)
				    descId : webRtcContext.wid + this.appUser.uid,
				    //Признау оптимизации вызова
				    optimize: initiator ? optimizeCall : webRtcContext.desc.optimize,
				    //Коллекция кандидатов, сгенерированных для текущего предложения
				    candidates : [],
				    extra : {callTime : explicit ? JSON.parse(this.store.selectSnapshot(LocalStorageState.callTime)) : 0 },
				}) ;
			    }
			    else if(data.type === 'answer'){
			        webRtcConnectionContext.descriptor = new Answer({
				    type : 'answers',
				    active : true,
				    contact : contact,
				    uid :  webRtcContext.desc.uid, //Идентификатор пользователя, на чьё предложение формируется ответ
				    descId : desc ? desc.messId : webRtcContext.desc.messId,
				    wid : webRtcContext.wid,
				    receivers : [ desc ? desc.sender : webRtcContext.sender],
				    sender : this.appUser,
				    desc : data,
				    optimize :  webRtcContext.desc.optimize,
				    candidates : [],
				});
			    }
			    
			    //Если оптимизация не установлена, тогда отправляем предложение или ответ
			    webRtcConnectionContext.descriptor.optimize || this.sendAnswerOffer(webRtcConnectionContext) ;
			    
			}else if(data.candidate){
			    //Сборка кандидатов
			    let descriptor = webRtcConnectionContext.descriptor;
			    //Сложный вариант отправки дескрипторов обусловлен не постоянной очередностью выдачи предложений-ответов и кандидатов
			    if(descriptor){
				let candidate = new Candidate({
				    wid : descriptor.wid,
				    contact :  contact ,
				    date : Date.now(),
				    sender : this.appUser,
				    descId : descriptor.messId,
				    type: 'candidates',
				    desc: data.candidate,
				    active : true,
				    optimize : descriptor.optimize,
				    uid : descriptor.uid,
				});
				//Проверка на опитимизацию соединения
				if(descriptor.optimize) descriptor.candidates.push(candidate) ;
				else this.databaseService.sendDescriptor(candidate).catch(this.onError);
			    }else{
			        //Если был создан кандидат до создания дескриптора - поместить его во временную коллекцию кандидатов
				webRtcConnectionContext.candidates.push(data.candidate) ;
			    }
			}
		    });
		    //Установка обработчика на изменения статуса сборки кандидатов
		    webRtcConnectionContext.pcConnection._pc.addEventListener('icegatheringstatechange', (event: any)=>{
			//Завершилась сборка кандидатов
			if(event.target.iceGatheringState === 'complete'){
			    //Сборка завершена
			    let desc : Offer | Answer =  webRtcConnectionContext.descriptor;
			    //Сложный вариант отправки дескрипторов обусловлен не постоянной очередностью выдачи предложений-ответов и кандидатов
			    if(desc && desc.optimize){
				if(desc.candidates.length > 0){
				    //Отправка дескриптора (offer/answer) на сервер
				    /answers|offers\/implicit/.test(desc.type) && this.databaseService.sendDescriptor(desc).then(()=> {
					console.log('Сборка кандидатов завершена. Кандидаты отправлены.') ;
				    }).catch(this.onError);
				    //Отправка явного дескриптора
				    /offers\/explicit/.test(desc.type) && this.sendOffer(webRtcConnectionContext);
				    //Установка обработчика приема ответа, если отправлен дескриптор предложения
				    desc.type.indexOf('offers') > -1 && this.setAnswerListener(webRtcConnectionContext);
				}else{
				    this.onError('Сбой отправки кандидатов в событии icegatheringstatechange.');
				    //TODO определить отображение сбоев несовместимости браузеров пользователю.
				    this.setAnnouncement({type : 'incompatibilityFailure'  , desc : {text : 'Сбой несовместимости.'}});
				}
			    }else if(!desc){
				
			    }
			}
		    }) ;
		    //Установка обработчика на изменение статуса соединения для установки пользовательской индикации
		    webRtcConnectionContext.pcConnection._pc.addEventListener('connectionstatechange', (event: any)=>{
			let contact = webRtcConnectionContext.messageContext.contact.value;
			contact.indicator = this.statusColorService.statusColors.webrtc.perConnectionStates[event.target.connectionState];
			webRtcConnectionContext.messageContext.contact.next(contact);
		    }) ;
		    //обработчик установки готовности соединения передачи данных по каналу данных
		    webRtcConnectionContext.pcConnection.on('connect', () => {
			initiator || (webRtcConnectionContext.messageContext.dataChannel.channel = webRtcConnectionContext.pcConnection._channel) ;
			//Если текущее сообщение является текстовым, тогда нужно передать текст, напечатанный пользователем в поле ввода
			// Если это видеосообщение, тогда передать информацию о включенных аппаратных средствах
			webRtcConnectionContext.pcConnection.send(JSON.stringify(desc.kind === 'text' ?  {type : desc.kind, text : desc.text} : this.videoAudioDefault));
		    });
		    //Обработчик получения данных по канаду данных. Если его тип - это текст, тогда отображеем полученный текст в интерфейсе
		    webRtcConnectionContext.pcConnection.on('data', (data : any) => {
			//Обработка данных активности , текстовых сообщений, закрытие соединения и пр. удаленного пира
			let d = JSON.parse(data);
			if(d.type === 'text'){
			   //Отобразить текст в интерфейсе пользователя
			}else if(d.type === 'settings'){
			    //Если тип является настойкой, тогда передаем в канал отображения метаданных видеосообщения
			    webRtcConnectionContext.messageContext.dataChannel.data.next();
			}
		    });
		    //Обработка получения удаленного потока
		    webRtcConnectionContext.pcConnection.on('stream', stream => {
			webRtcConnectionContext.messageContext.stream.next(stream);
			//добавление контекста сообщения в коллекцию контекстов сообщений
			webRtcContext.messageCollection.push(webRtcConnectionContext.messageContext);
			//обновление интерфейса
			this.appChangeDetector.markForCheck();
		    });
		    //Закрыто текущее соединение
		    webRtcConnectionContext.pcConnection.on('close', (event) => {}) ;
		    //Ошибка в соединениии
		    webRtcConnectionContext.pcConnection.on('error', (err) => {
			this.onError(err);
			return true;
		    });
		    //Установка удаленного дескриптора - явного предложения
		    if(!initiator && contactIndex === 0){
			this.setDescriptor(webRtcConnectionContext.pcConnection,  desc || webRtcContext.desc );
		    }
		}else if(localIndex > contactIndex){
		    //Установка обработчиков не явного предложения
		    this.setImplicitListener(webRtcContext.wid + contact.uid);
		}
	    })
	}
	this.appChangeDetector.markForCheck();
    }
    
    //Обработчик ответов и неявных предложений
    handleDescriptor(webRtcConnectionContext, snap){
	let desc = snap.val();
	//Установка в соединение ответа
	desc.type.indexOf('answers') > -1 && this.setDescriptor(webRtcConnectionContext.pcConnection, desc);
	//Установка в соединение неявного предложения
	desc.type.indexOf('offers') > -1 && this.startConnections(desc);
    }
    
    sendAnswerOffer(webRtcConnectionContext){
	let desc = webRtcConnectionContext.descriptor;
	if(/answers|offers\/implicit/.test(desc.type)){
	    //Если тип ответа или неявного предложения
	    this.databaseService.sendDescriptor(desc);
	}else {
	    
	    this.sendOffer(webRtcConnectionContext).then(res => {
		//Установка обработчиков изменение статуса приема предложения.
		//Если статус приема предложения изменился, значит удаленный пир с ним контактировал различным образом
		//(принял/отклонил/пропустил). Этот обработчик нам сигнализирует об этом, что поможет в определении пропущенных
		//предложений при отказе инициатора от вызова, в момент, когда удаленный пир еще не поднял трубку.
		// Обработчик срабатывает при контакте удаленного пира с предложением, что не требует проверки этого явно.
		//Результат проверяется сразу при необходимости.
		this.setOfferContactListener(webRtcConnectionContext);
	    });
	}
	
	if(desc.type.indexOf('offers') > -1){
	    //Установка обработчиков получения ответов
	    this.setAnswerListener(webRtcConnectionContext);
	}
    }
    
    
    stopOfferContactListeners(){
	this.offerChangedUrls.forEach(url =>{
	    this.databaseService.getRef(url).off();
	})
    }
    
    //Функция устанавливает обработчики событий на изменения предложения, в случае приемы, игнорирования, отказа контакта
    setOfferContactListener(webRtcConnectionContext){
	let url = '/web-rtc/offers/explicit/'+ webRtcConnectionContext.uid;
	this.offerChangedUrls.push(url);
	this.databaseService.getRef(url).orderByChild('messId').equalTo(webRtcConnectionContext.descriptor.messId).on('value', function(webRtcConnectionContext, snap){
	    let val = snap.val();
	    val && (webRtcConnectionContext.webRtcContext.extra.actions[webRtcConnectionContext.uid] = {status : (Object.values(val)[0] as Offer).status , url : url + '/' + webRtcConnectionContext.descriptor.messId});
	}.bind(this, webRtcConnectionContext));
    }
    
    setAnswerListener(webRtcConnectionContext){
	this.databaseService.getRef('/web-rtc/answers/'+ this.appUser.uid).orderByChild("descId").equalTo(webRtcConnectionContext.descriptor.messId).once('child_added', this.handleDescriptor.bind(this, webRtcConnectionContext));
    }
    
    setImplicitListener(id){ //Установка неявных предложений обработчиков событий
	this.databaseService.getRef('/web-rtc/offers/implicit/'+ this.appUser.uid).orderByChild("descId").equalTo(id).once('child_added', this.handleDescriptor.bind(this, id));
    }
    
  setPopup(desc){
      if(desc) {
	  this.appContext.setPopups({
	      add : true,
	      popup : new IncomingPopupContext({
		  type : 1,
		  text : 'Входящий вызов',
		  active : true,
		  contact : desc.sender,
		  desc : desc,
		  listener : this.startWebRtc.bind(this, desc),
		  extra : {timeout : true, callTime : desc.extra.callTime},
	      })}) ;
	  this.appChangeDetector.detectChanges();
      }
  }
    
    setDescriptor(pcConnection, desc){
	let that = this;
	//Установить предложение / ответ
	pcConnection.signal(desc.desc);
	
	if(/answers/.test(desc.type)){
	    //Удаление принятого ответа из базы после его получения
	    deleteDesc(desc);
	}else{
	    //Снятие признака активности принятого предложения
	    this.databaseService.setDescriptorOptions({descriptor: desc, data : {active: false, status : 'accepted'}}).then(res =>{
		//Удаление из базы принятого дескриптора. Такой подход нужен для того, чтобы первая запись меняла статус действия и снимала активность, для согласования внутренних отслеживаний принятий удаленных дескрипторов. Вторая фаза - это удаление уже помеченного дескриптора.
		deleteDesc(desc);
	    }).catch(err => this.onError(err));
	    //Если принимается явное предложение, создаем сообщение в области входящих сообщений
	    if(desc.type === 'offers/explicit'){
		//Изменение входящего сообщения
		[  //Изменение сообщения, предназначенного для текущего пользователя
		    {path : '/messages/'+ this.appUser.uid +'/'+ desc.wid + '/actions' , data : {[desc.contact.uid] : 'accepted'}},
		    //Изменение сообщения инициатора
		    {path : '/messages/'+ desc.sender.uid +'/'+ desc.wid + '/actions' , data : {[desc.contact.uid] : 'accepted'}}
		].forEach(mess => {
		    //Пользователь  принял предложение - записываем это в область исходящих сообщений
		    this.databaseService.changeMessage(mess.path, mess.data);
		})
	    }
	}
	
	(async ()=> {
	    //Проверить кандидаты
	    //todo Обязательно! В этом месте, т.е. после установления удаленного дескриптора, и после
	    // установки локального потока, нужно установить СИНХРОННО удаленные кандидаты
	    //Установка/проверка кандидатов
	    await this.checkCandidates(desc, pcConnection);
	})();
	
	function deleteDesc(desc){
	    that.databaseService.deleteDescriptor({descriptor : desc}).then(()=>{}).catch(err =>  that.onError(err));
	}
	
	      function deleteOffer(desc){
		  // Этот функционал дублируется с функционалом вызывающей стороны метод сервиса wed-rtc.service stopVideoChannel(videoContext);
		  //Удаление дескриптора из базы данных
		  that.databaseService.database.ref(`web-rtc/${desc.type}/${desc.contact.uid}/${desc.messId}`).remove().then(()=> {
			  //Удаление кандидатов
			  that.databaseService.database.ref('/web-rtc/candidates/' + that.appUser.uid).orderByChild('descId').equalTo(desc.messId).once('value').then(res => {
				  res.forEach(item => {item.ref.remove()}) ;
				  })
			  });
	      }
    }
    
    //Запос кандидатов с сервера
    async requestCandidates(desc){
	return this.databaseService.database.ref(`/web-rtc/candidates/${this.appUser.uid}`).orderByChild('descId').equalTo(desc.messId).once('value');
    }
    
    //Обработчик установки или запроса с установкой кандидатов, в зависимости от настроек оптимизации
    checkCandidates(desc, pcConnection) {
	let that = this;
	return  new Promise((res, rej)=> {
	    if(desc.optimize){
		setCandidates.bind(this, desc.candidates, res)() ;
	    }else {
		this.requestCandidates(desc).then(r => {
		    let val = r.val();
		    val && setCandidates.bind(this, Object.values(val),res)()
		}).catch(this.onError);
	    }
	});
	function setCandidates(candidates, res){
	    candidates.forEach(candidate => {
		pcConnection.signal({candidate : candidate.desc});
		//Удаление кандидата из базы после его получения
		that.databaseService.deleteDescriptor({descriptor : candidate}).then(()=>{}).catch(err =>  that.onError(err));
	    }) ;
	    res();
	}
    }
    
    
    //Остановка видеоконтекстов
    stopVideoChannel(videoContext){
	let webRtcContext = this.appContext.webRtcContexts.getContext(videoContext.wid),
	    conUid = videoContext.contact.value.uid;
	if(webRtcContext){
	    conUid = (conUid === this.appUser.uid || webRtcContext.messageCollection.length == 2) ? undefined : conUid;
	    //Отправка сообщений всем пирам о прекращении соединения локальным контекстом
	    conUid || this.sendDataMessages(videoContext.wid, this.appUser.uid, {type : 'status', statusColor : this.statusColorService.statusColors.webrtc.perConnectionStates['closed'], statusText : 'closed'}) ;
	    for(let i = webRtcContext.messageCollection.length - 1 ; i >= 0 ; i--){
		let vc = webRtcContext.messageCollection[i],
		    exactly = vc.contact.value.uid === conUid;
		if(!conUid || exactly){
		    let webRtcConnectionContext = webRtcContext.webRtcConnections[vc.contact.value.uid];
		    vc.stream.value && vc.stream.value.getTracks().forEach(track => track.stop());
		    webRtcConnectionContext.pcConnection && webRtcConnectionContext.pcConnection.destroy();
		    webRtcContext.messageCollection.splice(i, 1);
		}
		//Идентификатор контакта определен - прервать цикл на удалении только одного соединения
		if(exactly) break;
	    }
	    //Идентификатор контакта неопределен - закрыть все соединения
	    if(!conUid){
		//Очистить таймаут (На тот случай, если пользователь запустил соединение
		// и тут же его отменил, что бы после отмены соединения не проверялось предложение на
		// предмет состояния вызовов)
		// Вторая часть: При отмене вызова, когда удаленный пир еще не ответил, возникает необходимость
		//сбросить метку активности с предложения и/или с кандидатов, или удалить кандидаты
		if(webRtcContext.extra.timeout){
			clearTimeout(webRtcContext.extra.timeout);
			webRtcContext.extra.timeout = undefined;
		}
		//Продолжение второй части: первая часть web-rtc-component setOfferContactListener() 126
		//Анализ работы метода в указанной строке : если значение существует, значит, удаленный пир среагировал на соединение
		//, иначе изменяем значения свойств предложения
		for(let key in webRtcContext.extra.actions){
		    let elem = webRtcContext.extra.actions[key];
		    if(/offered|ignored/.test(elem.action)){ //elem.action elem.url
			//Удаление предложения прерванного вызова
			this.databaseService.database.ref(elem.url).remove();
			//Удаление всех кандидатов прерванного вызова
			let urlArr = elem.url.split('/');
			this.databaseService.database.ref('/web-rtc/candidates/' + urlArr[urlArr.length - 2]).orderByChild('descId').equalTo(urlArr[urlArr.length - 1]).once('value').then(res => {
			    res.forEach(item => {item.ref.remove()}) ;
			    
			})
		    }
		}
		
		//Очистить коллекцию контекстов
		this.appContext.webRtcContexts.deleteAllContexts();
		//Очистить локальные настройки
		this.appContext.localVideoAudio = {type : 'settings', video : 1, audio : 1};
		//Переход на другую страницу
		this.ngZone.run(() => {
		    this.router.navigateByUrl('/application/main/new-message');
		});
	    }
	}
    }
    
    //Установка уведомления на страницу Announcement.component
    setAnnouncement(popup){
	//Коллекция элементов на странице уведомлений
	this.announcements.unshift(popup);
	this.store.dispatch(new AnnouncementsAction(this.announcements));
	this.appChangeDetector.markForCheck();
    }
    //Проверка статуса соединения
    checkConnectionState(options){
	//Завершение соединения, если контакт разъединился
	if(/failed|closed/.test(options.state)){
	    //Выдать уведомление о закрытии контактом соединения
	    this.setAnnouncement(new PopupContext({
		uid : uuid(),
		type : 2,
		date : Date.now(),
		active : true,
		listener : ()=>{},
		contact : options.contact,
		text :  'Контакт прервал соединение.',
	    })) ;
	    //Закрыть текущее соединение
	    this.stopVideoChannel(options.messageContext);
	}
    }
    
    checkMessageContexts(videoContext) {
	//Проверяет кконтексты сообщений. Если активных больше одного, тогда локальному контексту
	//присваевается класс fixed (фиксированный), регулирующий поведение в интерфейсе :
	// элемент становиться абсолютным, уменьшенным в размере, принимает положение внизу слева
	let webRtcContext = this.appContext.webRtcContexts.getContext(videoContext.wid),
	    local =  webRtcContext.messageCollection.filter(video => video.contact.value.uid === this.appUser.uid)[0];
	if (local) {
	    //Установка элементу локальному контексту фиксированный класс для принятия абсолютной позиции
	    //и снятие иконки вызывающей пульсации
	    local.className.fixed = webRtcContext.messageCollection.filter(video => video.className.active).length > 1;
	    //Снятие пульсации
	    local.className.pulse = false;
	    //todo Можно останавливать звуковой файл вызова.
	}
    }
    
    onError(error){
	console.log(error);
    }
    
    static clearContextTimeouts(webRtcConnectionContext){
	if(webRtcConnectionContext.timeout){
	    window.clearTimeout(webRtcConnectionContext.timeout);
	    webRtcConnectionContext.timeout = undefined;
	}
    }
    
    sendDataMessages(wid, uid, message){
	let webRtcContext = this.appContext.webRtcContexts.getContext(wid);
	webRtcContext && webRtcContext.messageCollection.forEach(messageContext =>{
	    if(messageContext.contact.value.uid !== uid){
		if(!!messageContext.dataChannel.channel && messageContext.dataChannel.channel.readyState === 'open'){
		    messageContext.dataChannel.channel.send(JSON.stringify(message));
		}
	    }
	})
    }
    //Перед отправкой явного предложения,нужно определить необходимость :
    //1. Дублировать ли вызов, отправкой PushNotification сообщения без проверки нахождения пользователя в сети, или
    //такую проверку произвести, и в случае отсутствия пользователя в сети, отправить ему уведомление
 
    sendOffer(webRtcConnectionContext): Promise<any>{
	let that = this,
	    offer = webRtcConnectionContext.descriptor;
	//Если нужно дублировать вызов отправкой оповещения - запускаем оповещение ,
	//иначе, проверяем находиться ли пользователь в сети, и если нет, то запускаем оповещение
	if(JSON.parse(this.store.selectSnapshot(LocalStorageState.duplicateCall))) {
	    //Передача предложения не зависимо от нахождения пользователя в сети
	    return send.bind(this, false)();
	}
	else{
	    //Находиться ли контакт в сети
	    return this.databaseService.getUserOnline(offer.contact.uid).then(onlineSnap =>{
		return send.bind(this, onlineSnap.val())();
	    })
	}
	async function send(online){
	    //Если контакт не находиться в сети - отправляем ему push уведомление
	    if(!online){
	        //Если пользователь анонимный - вызов пользователя происходит только по sms
		if(that.appUser.isAnonymous){
		    that.smsService.sendSms(offer);
		}
		//Если пользователь не анонимный - вызов будет осуществлен, согласно настроек модели вызова
		else {
		    switch (that.store.selectSnapshot(LocalStorageState.callMode)) {
			case 'sms' : { //режим отправки sms
			    // Если контакт присутствует в списке контактов пользователя, и них нет номеров телефонов, тогда отправляем Push уведомление
			    that.store.selectSnapshot(AppContextState.contacts).some(cont => cont.uid === offer.contact.uid) ? that.firebaseMessagingService.sendNotification(offer) : that.smsService.sendSms(offer);
			}
			    break;
			case 'push' : { //Режим отправки push
			    that.firebaseMessagingService.sendNotification(offer);
			}
		    } //'0' -sms '1'-push
		}
	    }
	    //Отправка самого дескриптора
	    await that.databaseService.sendDescriptor(offer).then(res => {
		console.log('Предложение отправлено контакту '+ offer.contact.uid);
	    }).catch(that.onError);
	}
	
    }
  
}

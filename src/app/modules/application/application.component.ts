import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ScreenInstallService} from "../../services/screen-install.service";
import {AppContextService} from "../../services/app-context.service";
import {PermissionsService} from "../../services/permissions.service";
import {fadeAnimation} from "../../animations/animations";
import {FirebaseMessagingService} from "../../services/firebase-messaging.service";
import {Select, Store} from "@ngxs/store";
import {AppContextState, StatusIndicatorsState} from "../../store/states";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {FirebaseDatabaseService} from "../../services/firebase-database.service";
import {Actions} from "../../store/actions";
import UsersAction = Actions.UsersAction;
import ContactsAction = Actions.ContactsAction;
import AnnouncementsAction = Actions.AnnouncementsAction;
import MessagesAction = Actions.MessagesAction;

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'] ,
    animations : [fadeAnimation]
})
export class ApplicationComponent implements OnInit, OnDestroy {

    public appUser;
    public subscribes = [];
    @Select(StatusIndicatorsState.hardwareStatus) public hardwareStatus$ : Observable<any> ;
    @Select(StatusIndicatorsState.startedStatus) public startedStatus$ : Observable<boolean> ;
    @Select(AppContextState.popups) public popups$ : Observable<any> ;
    
    
    constructor(
	public zone : NgZone,
	public router : Router,
	public store : Store,
	public appContextService : AppContextService,
	public firebaseDatabase : FirebaseDatabaseService,
	public firebaseMessaging : FirebaseMessagingService,
	public permissionsService : PermissionsService,
	public screenInstallService : ScreenInstallService,
  ) {}

  ngOnInit(): void {
        //Запускаем, когда появился пользователь
        this.subscribes.push(this.startedStatus$.subscribe( startedStatus => {
	    startedStatus && this.initializeServices().then(()=>{
	        //Получить пользователя
		this.appUser = this.store.selectSnapshot(AppContextState.appUser);
		//Подписка на получение всех пользователей приложения
		this.firebaseDatabase.database.ref('/users').on('value', (usersSnap)=>{
		    let users = usersSnap.val();
		    this.store.dispatch(new UsersAction(Object.values(users || [])))
		});
		//Подписка на получение всех контактов пользователя
		this.firebaseDatabase.database.ref(`/contacts/${this.appUser.uid}`).on('value', (contactsSnap)=>{
		    let contacts = contactsSnap.val();
			this.store.dispatch(new ContactsAction(Object.values(contacts || [])))
		}) ;
		//Подписка на получение всех уведомлений пользователя. Уведомления - то, то получил пользователь через Push Notification
		this.firebaseDatabase.database.ref(`/announcements/${this.appUser.uid}`).on('value', (announcementsSnap)=>{
		    let announcements = announcementsSnap.val();
		    this.store.dispatch(new AnnouncementsAction(Object.values(announcements || [])))
		});
	        //Подписка на получение всех сообщений. Сообщения - Видео и текстовые сообщения (входящие, исходящие, пропущенные),
		this.firebaseDatabase.database.ref(`/messages/${this.appUser.uid}`).on('value', (messagesSnap)=>{
		    let messages = messagesSnap.val();
		    this.store.dispatch(new MessagesAction(messages || []))
		})
		//Подписка на изменение статуса аппаратных средств
		this.subscribes.push(this.hardwareStatus$.subscribe(hardwareStatus =>{
		    //Проверка статуса аппаратных средств
		    if(hardwareStatus && !hardwareStatus.state){
			this.zone.run(()=> this.router.navigate(['application', 'hardware']).catch(err => console.log(err)))
		    }
		}))  ;
	    }).catch(err => {});
	}))
  }
  ngOnDestroy() {
        this.subscribes.forEach(sub => {
            sub.unsubscribe();
	})
      //Снять все обработчики
        this.firebaseDatabase.removeListeners();
    
  }
    
    async initializeServices(){
      //Инициализация сервисов
      await this.screenInstallService.initialize();
      // # Сервис обмена сообщениями
      await this.firebaseMessaging.initialize();
      // # Сервис проверки разрешений пользователя на использования камеры и микрофона
      await this.permissionsService.checkPermissions();
  }
}

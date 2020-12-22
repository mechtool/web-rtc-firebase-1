import {Action, Selector, State, StateContext} from "@ngxs/store";
import {ChangeDetectorRef, Injectable} from "@angular/core";
import {Actions} from "./actions";
import {Contact, Message} from "../classes/Classes";
import ColorThemeAction = Actions.ColorThemeAction;
import AppUserAction = Actions.AppUserAction;
import BeforeInstallAction = Actions.BeforeInstallAction;
import AppPermissionsAction = Actions.AppPermissionsAction;
import StunTurnConfigAction = Actions.StunTurnConfigAction;
import ContactsAction = Actions.ContactsAction;
import AnnouncementsAction = Actions.AnnouncementsAction;
import OnLineAction = Actions.OnLineAction;
import MessagesAction = Actions.MessagesAction;
import UsersAction = Actions.UsersAction;
import ActivatedContactsAction = Actions.ActivatedContactsAction;
import ContactsLimitAction = Actions.ContactsLimitAction;
import UpdateTypeAction = Actions.UpdateTypeAction;
import ExcludeAddedAction = Actions.ExcludeAddedAction;
import HardwareAction = Actions.HardwareAction;
import HardwareStatusAction = Actions.HardwareStatusAction;
import LanguageAction = Actions.LanguageAction;
import StartedStatusAction = Actions.StartedStatusAction;
import ContactModeAction = Actions.ContactModeAction;
import VideoHardwareAction = Actions.VideoHardwareAction;
import AudioHardwareAction = Actions.AudioHardwareAction;
import ChangeDetectorAction = Actions.ChangeDetectorAction;
import StunTurnAction = Actions.StunTurnAction;
import OptimizeCallAction = Actions.OptimizeCallAction;
import CallSaveAction = Actions.CallSaveAction;
import CallTimeAction = Actions.CallTimeAction;
import PopupsAction = Actions.PopupsAction;
import CallModeAction = Actions.CallModeAction;
import DuplicateCallAction = Actions.DuplicateCallAction;
import UpdateAction = Actions.UpdateAction;
import AppUserChangedAction = Actions.AppUserChangedAction;

export interface StatusIndicatorsModel {
    hardwareStatus : {state : boolean, result : any[]};
    startedStatus : boolean;
}
@State<StatusIndicatorsModel>({
    
    name: 'statusIndicators',
    defaults: {
	hardwareStatus : undefined,
	startedStatus : false,
    }
})
@Injectable()
export class StatusIndicatorsState {
    //Статус состояния наличия подключенных аппаратных средств (камера, микрофон, динамики)
    @Action(HardwareStatusAction) hardwareStatus(ctx: StateContext<StatusIndicatorsModel>, action: HardwareStatusAction) {
	ctx.patchState({hardwareStatus: action.hardwareStatus});
    }
    //Статус запуска приложения (Изменяется в компоненте AppComponent, после инициализации пользователя)
    @Action(StartedStatusAction) started(ctx: StateContext<StatusIndicatorsModel>, action: StartedStatusAction) {
	ctx.patchState({startedStatus: action.startedStatus});
    }

    //--------------selectors-----------------------------
    
    @Selector() static hardwareStatus(state: StatusIndicatorsModel) {
	return state.hardwareStatus;
    }
    @Selector() static startedStatus(state: StatusIndicatorsModel) {
	return state.startedStatus;
    }
}

export interface LocalStorageModel {
    contactsLimit : string;  //Ограничение выбора контактов
    updateType : string; //Тип обловления приложения
    excludeAdded : string ; //Исключать уже выбранных контактов из новой выборки
    language : string; // Локаизация приложения
    videoHardware : string; //Текущие настройки аппаратных средства видео
    audioHardware : string; //Текущие настройки аппаратных средства видео
    stunTurn : string; //Тип использованных настоек stun/turn серверов
    callSave : string; //Признак сохранения вызовов в базе данных
    duplicateCall : string; //Дублирование вызова. В случае отсутствия пользователя в сети вызов дублируется либо sms,либо push
    callMode : string; //Режим вызова (sms/push)
    callTime : string; //[20000, 30000, 40000] Длительность вызова пользователей, после которого происходит проверка ответов.
    optimizeCall : string;// Опртимизация вызова. Признак поддержки ICE trickling (просачивание кандидатов)
    contactMode : string; // Режим отображение контакта (icon - отображается иконка из свойства contact.photoUrl с фоном из свойства backColor ; text - иконка не отображается, вместо нее отображается прямоугольное поле с фоном из свойства backColor, и на этом фоне отображается заглавная буква из свойств либо userName, secondName, thirdName, phoneNumber, email)
}
@State<LocalStorageModel>({
    
    name: 'localStorage',
    defaults: {
	contactsLimit : undefined,
	updateType : '0',
	excludeAdded : 'false',
	stunTurn : 'Default',
	language : undefined,
	contactMode : undefined,
	optimizeCall : 'false',
	callSave : 'false',
	duplicateCall : 'false',
	callMode : 'push',
	callTime : '30000',
	videoHardware : undefined,
	audioHardware : undefined,
    }
})
@Injectable()
export class LocalStorageState {
    //Ограничение контактов в выборку вызовов
    @Action(ContactsLimitAction) contactsLimit(ctx: StateContext<LocalStorageModel>, action: ContactsLimitAction) {
        window.localStorage.setItem('contactsLimit', action.contactsLimit) ;
	ctx.patchState({contactsLimit: action.contactsLimit});
    }
    //Исключать уже добавленные контакты в выборке контактов
    @Action(ExcludeAddedAction) excludeAdded (ctx: StateContext<LocalStorageModel>, action: ExcludeAddedAction) {
	window.localStorage.setItem('excludeAdded', action.excludeAdded) ;
	ctx.patchState({excludeAdded: action.excludeAdded});
    }
    @Action(StunTurnAction) stunTurn (ctx: StateContext<LocalStorageModel>, action: StunTurnAction) {
	window.localStorage.setItem('stunTurn', action.stunTurn) ;
	ctx.patchState({stunTurn: action.stunTurn});
    }
    // Оптимизация вызова. Определяет как отправлять предложение/ответ - с кандидатами вместе или отдельно
    @Action(OptimizeCallAction) optimizeCall (ctx: StateContext<LocalStorageModel>, action: OptimizeCallAction) {
	window.localStorage.setItem('optimizeCall', action.optimizeCall) ;
	ctx.patchState({optimizeCall: action.optimizeCall});
    }
    //Сохранение вызовов в базе данных
    @Action(CallSaveAction) callSave (ctx: StateContext<LocalStorageModel>, action: CallSaveAction) {
	window.localStorage.setItem('callSave', action.callSave) ;
	ctx.patchState({callSave: action.callSave});
    }
    //Дублирование вызова контакта вне сети
    @Action(DuplicateCallAction) duplicateCall(ctx: StateContext<LocalStorageModel>, action: DuplicateCallAction) {
	window.localStorage.setItem('duplicateCall', action.duplicateCall) ;
	ctx.patchState({duplicateCall: action.duplicateCall});
    }
    //Режим вызова контакта. В случае, если контакт не находиться в сети, для его вызова, ему направляется либо push - уведомление, либо sms платное сообщение (для анонимных пользователей используется только платное sms)
    @Action(CallModeAction) callMode (ctx: StateContext<LocalStorageModel>, action: CallModeAction) {
	window.localStorage.setItem('callMode', action.callMode) ;
	ctx.patchState({callMode: action.callMode});
    }
    //Длительность вызова контактов
    @Action(CallTimeAction) callTime (ctx: StateContext<LocalStorageModel>, action: CallTimeAction) {
	window.localStorage.setItem('callTime', action.callTime) ;
	ctx.patchState({callTime: action.callTime});
    }
    //Тип обновления приложения
    @Action(UpdateTypeAction) updateType(ctx: StateContext<LocalStorageModel>, action: UpdateTypeAction) {
	window.localStorage.setItem('updateType', action.updateType) ;
	ctx.patchState({updateType: action.updateType});
    }
    //Выбираемый пользователем язык интерфейса
    @Action(LanguageAction) language(ctx: StateContext<LocalStorageModel>, action: LanguageAction) {
	window.localStorage.setItem('language', action.language) ;
	ctx.patchState({language: action.language});
    }
    //Аппаратные средства, настраиваемые пользователем
    @Action(VideoHardwareAction) videoHardware(ctx: StateContext<LocalStorageModel>, action: VideoHardwareAction) {
	window.localStorage.setItem('videoHardware', action.videoHardware) ;
	ctx.patchState({videoHardware: action.videoHardware});
    }
    @Action(AudioHardwareAction) audioHardware(ctx: StateContext<LocalStorageModel>, action: AudioHardwareAction) {
	window.localStorage.setItem('audioHardware', action.audioHardware) ;
	ctx.patchState({audioHardware: action.audioHardware});
    }
    //Режим отображения контакта
    @Action(ContactModeAction) contactMode(ctx: StateContext<LocalStorageModel>, action: ContactModeAction) {
	window.localStorage.setItem('contactMode', action.contactMode) ;
	ctx.patchState({contactMode: action.contactMode});
    }
    
    //--------------selectors-----------------------------
    
    @Selector() static contactsLimit(state: LocalStorageModel) {
	return state.contactsLimit;
    }
    @Selector() static excludeAdded(state: LocalStorageModel) {
	return state.excludeAdded;
    }
    @Selector() static stunTurn(state: LocalStorageModel) {
	return state.stunTurn;
    }
    @Selector() static optimizeCall(state: LocalStorageModel) {
	return state.optimizeCall;
    }
    @Selector() static duplicateCall(state: LocalStorageModel) {
	return state.duplicateCall;
    }
    @Selector() static callSave(state: LocalStorageModel) {
	return state.callSave;
    }
    @Selector() static callMode(state: LocalStorageModel) {
	return state.callMode;
    }
    @Selector() static callTime(state: LocalStorageModel) {
	return state.callTime;
    }
    @Selector() static updateType(state: LocalStorageModel) {
	return state.updateType;
    }
    @Selector() static language(state: LocalStorageModel) {
	return state.language;
    }
    @Selector() static contactMode(state: LocalStorageModel) {
	return state.contactMode;
    }
    @Selector() static videoHardware(state: LocalStorageModel) {
	return state.videoHardware;
    }
    @Selector() static audioHardware(state: LocalStorageModel) {
	return state.audioHardware;
    }
}

export interface AppContextModel {
    appColorClass : string; // Цветовой класс приложения
    beforeInstall : boolean | Event;
    appUser : Contact | null,
    appUserChanged : Contact,
    permissions : any[],
    popups : any[],
    stunTurnConfig : any;
    changeDetector : ChangeDetectorRef,
    announcements : any[],
    contacts : Contact[];
    activatedContacts : Contact[];
    users : Contact[];
    messages : Message[];
    onLine : boolean;
    hardware : any[];
}
@State<AppContextModel>({
    name: 'appContext',
    defaults: {
	appColorClass : '',
	beforeInstall : false,
	appUser : undefined,
	appUserChanged : undefined,
	permissions : undefined,
	stunTurnConfig : undefined,
	changeDetector : undefined,
	announcements : [],
	popups : [],
	contacts : [],
	users : [],
	messages : [],
	activatedContacts : [],
	onLine : undefined,
	hardware : [],
    }
})
@Injectable()
export class AppContextState {
    //Установка класса цветовой темы
    @Action(ColorThemeAction) setColorTheme(ctx: StateContext<AppContextModel>, action: ColorThemeAction) {
	ctx.patchState({appColorClass: action.appColorClass});
    }
    @Action(BeforeInstallAction) setBeforeInstall(ctx: StateContext<AppContextModel>, action: BeforeInstallAction) {
	ctx.patchState({beforeInstall: action.beforeInstall});
    }
    @Action(AppUserAction) setAppUser(ctx: StateContext<AppContextModel>, action: AppUserAction) {
	ctx.patchState({appUser: action.appUser});
    }
    @Action(AppUserChangedAction) setAppUserChanged(ctx: StateContext<AppContextModel>, action: AppUserChangedAction) {
	ctx.patchState({appUserChanged: action.appUserChanged});
    }
    @Action(AppPermissionsAction) setPermissions(ctx: StateContext<AppContextModel>, action: AppPermissionsAction) {
	ctx.patchState({ permissions : action.permissions});
    }
    @Action(StunTurnConfigAction) getStunTurn(ctx: StateContext<AppContextModel>, action: StunTurnConfigAction) {
	ctx.patchState({ stunTurnConfig: action.stunTurnConfig});
    }
    @Action(ChangeDetectorAction) changeDetector(ctx: StateContext<AppContextModel>, action: ChangeDetectorAction) {
	ctx.patchState({ changeDetector: action.changeDetector});
    }
    @Action(HardwareAction) hardware(ctx: StateContext<AppContextModel>, action: HardwareAction) {
	ctx.patchState({ hardware : action.hardware});
    }
    @Action(ContactsAction) contacts(ctx: StateContext<AppContextModel>, action: ContactsAction) {
	ctx.patchState({ contacts: action.contacts});
    }
    @Action(PopupsAction) popups(ctx: StateContext<AppContextModel>, action: PopupsAction) {
	ctx.patchState({ popups : action.popups});
    }
    @Action(UsersAction) users(ctx: StateContext<AppContextModel>, action: UsersAction) {
	ctx.patchState({ users: action.users});
    }
    @Action(ActivatedContactsAction) activatedContacts(ctx: StateContext<AppContextModel>, action: ActivatedContactsAction) {
	ctx.patchState({ activatedContacts: action.activatedContacts});
    }
    @Action(MessagesAction) messages(ctx: StateContext<AppContextModel>, action: MessagesAction) {
	ctx.patchState({ messages: action.messages});
    }
    @Action(AnnouncementsAction) announcements(ctx: StateContext<AppContextModel>, action: AnnouncementsAction) {
	ctx.patchState({ announcements: action.announcements});
    }
    @Action(OnLineAction) online(ctx: StateContext<AppContextModel>, action: OnLineAction) {
	ctx.patchState({onLine: action.online});
    }
    
    //--------------selectors-----------------------------
    
    @Selector() static permissions(state: AppContextModel) {
	return state.permissions;
    }
    @Selector() static appUser(state: AppContextModel) {
	return state.appUser;
    }
    @Selector() static appUserChanged(state: AppContextModel) {
	return state.appUserChanged;
    }
    @Selector() static appColorClass(state: AppContextModel) {
	return state.appColorClass;
    }
    @Selector() static hardware(state: AppContextModel) {
	return state.hardware;
    }
    @Selector() static stunTurnConfig(state: AppContextModel) {
	return state.stunTurnConfig;
    }
    @Selector() static changeDetector(state: AppContextModel) {
	return state.changeDetector;
    }
    @Selector() static contacts(state: AppContextModel) {
	return state.contacts;
    }
    @Selector() static popups(state: AppContextModel) {
	return state.popups;
    }
    @Selector() static activatedContacts(state: AppContextModel) {
	return state.activatedContacts;
    }
    @Selector() static users(state: AppContextModel) {
	return state.users;
    }
    @Selector() static messages(state: AppContextModel) {
	return state.messages;
    }
    @Selector() static announcements(state: AppContextModel) {
	return state.announcements;
    }
    @Selector() static onLine(state: AppContextModel) {
	return state.onLine;
    }
}


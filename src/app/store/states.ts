import {Action, Selector, State, StateContext} from "@ngxs/store";
import { Injectable} from "@angular/core";
import {Actions} from "./actions";
import {Contact, Message, UserContact} from "../classes/Classes";
import ColorThemeAction = Actions.ColorThemeAction;
import AppUserAction = Actions.AppUserAction;
import BeforeInstallAction = Actions.BeforeInstallAction;
import AppPermissionsAction = Actions.AppPermissionsAction;
import ApiKeysAction = Actions.ApiKeysAction;
import StunTurnConfigAction = Actions.StunTurnConfigAction;
import ContactsAction = Actions.ContactsAction;
import AnnouncementsAction = Actions.AnnouncementsAction;
import OnLineAction = Actions.OnLineAction;
import MessagesAction = Actions.MessagesAction;
import UsersAction = Actions.UsersAction;
import ActivatedContactsAction = Actions.ActivatedContactsAction;
import ContactsLimitAction = Actions.ContactsLimitAction;
import GoogleAuthAction = Actions.GoogleAuthAction;
import UpdateTypeAction = Actions.UpdateTypeAction;
import ExcludeAddedAction = Actions.ExcludeAddedAction;

export interface LocalStorageModel {
    contactsLimit : string;
    updateType : string;
    excludeAdded : string | number;
}
@State<LocalStorageModel>({
    
    name: 'localStorage',
    defaults: {
	contactsLimit : undefined,
	updateType : '0',
	excludeAdded : 0,
    }
})
@Injectable()
export class LocalStorageState {
    
    @Action(ContactsLimitAction) contactsLimit(ctx: StateContext<LocalStorageModel>, action: ContactsLimitAction) {
        window.localStorage.setItem('contactsLimit', action.contactsLimit) ;
	ctx.patchState({contactsLimit: action.contactsLimit});
    }
    @Action(ExcludeAddedAction) excludeAdded (ctx: StateContext<LocalStorageModel>, action: ExcludeAddedAction) {
	window.localStorage.setItem('excludeAdded', action.excludeAdded) ;
	ctx.patchState({excludeAdded: action.excludeAdded});
    }
    @Action(UpdateTypeAction) updateType(ctx: StateContext<LocalStorageModel>, action: UpdateTypeAction) {
	window.localStorage.setItem('updateType', action.updateType) ;
	ctx.patchState({updateType: action.updateType});
    }
    //--------------selectors-----------------------------
    
    @Selector() static contactsLimit(state: LocalStorageModel) {
	return state.contactsLimit;
    }
    @Selector() static excludeAdded(state: LocalStorageModel) {
	return state.excludeAdded;
    }
    @Selector() static updateType(state: LocalStorageModel) {
	return state.updateType;
    }
}

export interface AppContextModel {
    appColorClass : string;
    beforeInstall : boolean | Event;
    appUser : Contact,
    
    permissions : any[],
    apiKeys : any;
    stunTurnConfig : any;
    announcements : any[],
    contacts : UserContact[];
    activatedContacts : UserContact[];
    users : Contact[];
    messages : Message[];
    onLine : boolean;
    googleAuth : any;
}
@State<AppContextModel>({
    name: 'appContext',
    defaults: {
	appColorClass : '',
	beforeInstall : false,
	appUser : undefined,
	permissions : undefined,
	apiKeys : undefined,
	stunTurnConfig : undefined,
	announcements : [],
	contacts : [],
	users : [],
	messages : [],
	activatedContacts : [],
	onLine : undefined,
	googleAuth : false,
    }
})
@Injectable()
export class AppContextState {

    @Action(ColorThemeAction) setColorTheme(ctx: StateContext<AppContextModel>, action: ColorThemeAction) {
	ctx.patchState({appColorClass: action.appColorClass});
    }
    @Action(GoogleAuthAction) googleAuth(ctx: StateContext<AppContextModel>, action: GoogleAuthAction) {
	ctx.patchState({googleAuth : action.googleAuth});
    }
    @Action(BeforeInstallAction) setBeforeInstall(ctx: StateContext<AppContextModel>, action: BeforeInstallAction) {
	ctx.patchState({beforeInstall: action.beforeInstall});
    }
    @Action(AppUserAction) setAppUser(ctx: StateContext<AppContextModel>, action: AppUserAction) {
	ctx.patchState({appUser: action.appUser});
    }
    @Action(AppPermissionsAction) setPermissions(ctx: StateContext<AppContextModel>, action: AppPermissionsAction) {
	ctx.patchState({ permissions : action.permissions});
    }
    @Action(ApiKeysAction) getApiKeys(ctx: StateContext<AppContextModel>, action: ApiKeysAction) {
	ctx.patchState({ apiKeys: action.apiKeys});
    }
    @Action(StunTurnConfigAction) getStunTurn(ctx: StateContext<AppContextModel>, action: StunTurnConfigAction) {
	ctx.patchState({ stunTurnConfig: action.stunTurnConfig});
    }
    @Action(ContactsAction) contacts(ctx: StateContext<AppContextModel>, action: ContactsAction) {
	ctx.patchState({ contacts: action.contacts});
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
    @Selector() static googleAuth(state: AppContextModel) {
	return state.googleAuth;
    }
    @Selector() static appColorClass(state: AppContextModel) {
	return state.appColorClass;
    }
    @Selector() static apiKeys(state: AppContextModel) {
	return state.apiKeys;
    }
    @Selector() static stunTurnConfig(state: AppContextModel) {
	return state.stunTurnConfig;
    }
    @Selector() static contacts(state: AppContextModel) {
	return state.contacts;
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


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Action, Selector, State } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { Actions } from "./actions";
var ColorThemeAction = Actions.ColorThemeAction;
var AppUserAction = Actions.AppUserAction;
var BeforeInstallAction = Actions.BeforeInstallAction;
var AppPermissionsAction = Actions.AppPermissionsAction;
var ApiKeysAction = Actions.ApiKeysAction;
var StunTurnConfigAction = Actions.StunTurnConfigAction;
var ContactsAction = Actions.ContactsAction;
var AnnouncementsAction = Actions.AnnouncementsAction;
var OnLineAction = Actions.OnLineAction;
var MessagesAction = Actions.MessagesAction;
var UsersAction = Actions.UsersAction;
var ActivatedContactsAction = Actions.ActivatedContactsAction;
var ContactsLimitAction = Actions.ContactsLimitAction;
var GoogleAuthAction = Actions.GoogleAuthAction;
var UpdateTypeAction = Actions.UpdateTypeAction;
var ExcludeAddedAction = Actions.ExcludeAddedAction;
let LocalStorageState = class LocalStorageState {
    contactsLimit(ctx, action) {
        window.localStorage.setItem('contactsLimit', action.contactsLimit);
        ctx.patchState({ contactsLimit: action.contactsLimit });
    }
    excludeAdded(ctx, action) {
        window.localStorage.setItem('excludeAdded', action.excludeAdded);
        ctx.patchState({ excludeAdded: action.excludeAdded });
    }
    updateType(ctx, action) {
        window.localStorage.setItem('updateType', action.updateType);
        ctx.patchState({ updateType: action.updateType });
    }
    //--------------selectors-----------------------------
    static contactsLimit(state) {
        return state.contactsLimit;
    }
    static excludeAdded(state) {
        return state.excludeAdded;
    }
    static updateType(state) {
        return state.updateType;
    }
};
__decorate([
    Action(ContactsLimitAction)
], LocalStorageState.prototype, "contactsLimit", null);
__decorate([
    Action(ExcludeAddedAction)
], LocalStorageState.prototype, "excludeAdded", null);
__decorate([
    Action(UpdateTypeAction)
], LocalStorageState.prototype, "updateType", null);
__decorate([
    Selector()
], LocalStorageState, "contactsLimit", null);
__decorate([
    Selector()
], LocalStorageState, "excludeAdded", null);
__decorate([
    Selector()
], LocalStorageState, "updateType", null);
LocalStorageState = __decorate([
    State({
        name: 'localStorage',
        defaults: {
            contactsLimit: undefined,
            updateType: '0',
            excludeAdded: 0,
        }
    }),
    Injectable()
], LocalStorageState);
export { LocalStorageState };
let AppContextState = class AppContextState {
    setColorTheme(ctx, action) {
        ctx.patchState({ appColorClass: action.appColorClass });
    }
    googleAuth(ctx, action) {
        ctx.patchState({ googleAuth: action.googleAuth });
    }
    setBeforeInstall(ctx, action) {
        ctx.patchState({ beforeInstall: action.beforeInstall });
    }
    setAppUser(ctx, action) {
        ctx.patchState({ appUser: action.appUser });
    }
    setPermissions(ctx, action) {
        ctx.patchState({ permissions: action.permissions });
    }
    getApiKeys(ctx, action) {
        ctx.patchState({ apiKeys: action.apiKeys });
    }
    getStunTurn(ctx, action) {
        ctx.patchState({ stunTurnConfig: action.stunTurnConfig });
    }
    contacts(ctx, action) {
        ctx.patchState({ contacts: action.contacts });
    }
    users(ctx, action) {
        ctx.patchState({ users: action.users });
    }
    activatedContacts(ctx, action) {
        ctx.patchState({ activatedContacts: action.activatedContacts });
    }
    messages(ctx, action) {
        ctx.patchState({ messages: action.messages });
    }
    announcements(ctx, action) {
        ctx.patchState({ announcements: action.announcements });
    }
    online(ctx, action) {
        ctx.patchState({ onLine: action.online });
    }
    //--------------selectors-----------------------------
    static permissions(state) {
        return state.permissions;
    }
    static appUser(state) {
        return state.appUser;
    }
    static googleAuth(state) {
        return state.googleAuth;
    }
    static appColorClass(state) {
        return state.appColorClass;
    }
    static apiKeys(state) {
        return state.apiKeys;
    }
    static stunTurnConfig(state) {
        return state.stunTurnConfig;
    }
    static contacts(state) {
        return state.contacts;
    }
    static activatedContacts(state) {
        return state.activatedContacts;
    }
    static users(state) {
        return state.users;
    }
    static messages(state) {
        return state.messages;
    }
    static announcements(state) {
        return state.announcements;
    }
    static onLine(state) {
        return state.onLine;
    }
};
__decorate([
    Action(ColorThemeAction)
], AppContextState.prototype, "setColorTheme", null);
__decorate([
    Action(GoogleAuthAction)
], AppContextState.prototype, "googleAuth", null);
__decorate([
    Action(BeforeInstallAction)
], AppContextState.prototype, "setBeforeInstall", null);
__decorate([
    Action(AppUserAction)
], AppContextState.prototype, "setAppUser", null);
__decorate([
    Action(AppPermissionsAction)
], AppContextState.prototype, "setPermissions", null);
__decorate([
    Action(ApiKeysAction)
], AppContextState.prototype, "getApiKeys", null);
__decorate([
    Action(StunTurnConfigAction)
], AppContextState.prototype, "getStunTurn", null);
__decorate([
    Action(ContactsAction)
], AppContextState.prototype, "contacts", null);
__decorate([
    Action(UsersAction)
], AppContextState.prototype, "users", null);
__decorate([
    Action(ActivatedContactsAction)
], AppContextState.prototype, "activatedContacts", null);
__decorate([
    Action(MessagesAction)
], AppContextState.prototype, "messages", null);
__decorate([
    Action(AnnouncementsAction)
], AppContextState.prototype, "announcements", null);
__decorate([
    Action(OnLineAction)
], AppContextState.prototype, "online", null);
__decorate([
    Selector()
], AppContextState, "permissions", null);
__decorate([
    Selector()
], AppContextState, "appUser", null);
__decorate([
    Selector()
], AppContextState, "googleAuth", null);
__decorate([
    Selector()
], AppContextState, "appColorClass", null);
__decorate([
    Selector()
], AppContextState, "apiKeys", null);
__decorate([
    Selector()
], AppContextState, "stunTurnConfig", null);
__decorate([
    Selector()
], AppContextState, "contacts", null);
__decorate([
    Selector()
], AppContextState, "activatedContacts", null);
__decorate([
    Selector()
], AppContextState, "users", null);
__decorate([
    Selector()
], AppContextState, "messages", null);
__decorate([
    Selector()
], AppContextState, "announcements", null);
__decorate([
    Selector()
], AppContextState, "onLine", null);
AppContextState = __decorate([
    State({
        name: 'appContext',
        defaults: {
            appColorClass: '',
            beforeInstall: false,
            appUser: undefined,
            permissions: undefined,
            apiKeys: undefined,
            stunTurnConfig: undefined,
            announcements: [],
            contacts: [],
            users: [],
            messages: [],
            activatedContacts: [],
            onLine: undefined,
            googleAuth: false,
        }
    }),
    Injectable()
], AppContextState);
export { AppContextState };

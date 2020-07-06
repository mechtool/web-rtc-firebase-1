import {Announcement, Contact, Message, UserContact} from "../classes/Classes";

export namespace Actions {
    
    export class ColorThemeAction {
	static readonly type = '[App] Change ColorTheme';
	constructor(public appColorClass: string) {}
    }
    export class GoogleAuthAction {
	static readonly type = '[App] Get GoogleAuth';
	constructor(public googleAuth: any) {}
    }
    export class ExcludeAddedAction {
	static readonly type = '[App] Set ExcludeAdded';
	constructor(public excludeAdded: any) {}
    }
    export class ContactsLimitAction {
	static readonly type = '[App] Change ContactsLimit';
	constructor(public contactsLimit: string) {}
    }
    export class UpdateTypeAction {
	static readonly type = '[App] Change UpdateType';
	constructor(public updateType: string) {}
    }
    export class BeforeInstallAction {
	static readonly type = '[App] Change Before install';
	constructor(public beforeInstall: boolean | Event) {}
    }
    export class AppUserAction {
	static readonly type = '[App] Change AppUser';
	constructor(public appUser: Contact | null) {}
    }
    export class AppPermissionsAction {
	static readonly type = '[App] Set Permissions';
	constructor(public permissions: any[]) {}
    }
    export class ApiKeysAction {
	static readonly type = '[App] Get Api Keys';
	constructor(public apiKeys: any) {}
    }
    export class StunTurnConfigAction {
	static readonly type = '[App] Get Api StunTurn';
	constructor(public stunTurnConfig: any) {}
    }
    export class ContactsAction {
	static readonly type = '[App] Get Contacts';
	constructor(public contacts: UserContact[]) {}
    }
    export class UsersAction {
	static readonly type = '[App] Get Users';
	constructor(public users: Contact[]) {}
    }
    export class MessagesAction {
	static readonly type = '[App] Get Messages';
	constructor(public messages: Message[]) {}
    }
    export class AnnouncementsAction {
	static readonly type = '[App] Get Announcements';
	constructor(public announcements: Announcement[]) {}
    }
    export class OnLineAction {
	static readonly type = '[App] Set Online';
	constructor(public online: boolean) {}
    }
    export class ActivatedContactsAction {
	static readonly type = '[App] Set ActivatedContacts';
	constructor(public activatedContacts: UserContact[]) {}
    }

    
}

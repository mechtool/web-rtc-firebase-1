import {Announcement, Contact, Message} from "../classes/Classes";
import {ChangeDetectorRef} from "@angular/core";

export namespace Actions {      //hardware
    
    export class ColorThemeAction {
	static readonly type = '[App] Change ColorTheme';
	constructor(public appColorClass: string) {}
    }
    export class ExcludeAddedAction {
	static readonly type = '[App] Set ExcludeAdded';
	constructor(public excludeAdded: string) {}
    }
    export class ContactsLimitAction {
	static readonly type = '[App] Change ContactsLimit';
	constructor(public contactsLimit: string) {}
    }
    export class LanguageAction {
	static readonly type = '[App] Change Language';
	constructor(public language: string) {}
    }
    export class ContactModeAction {
	static readonly type = '[App] Change ContactMode';
	constructor(public contactMode: string) {}
    }
    //Аппаратные средства устройства
    export class HardwareAction {
	static readonly type = '[App] Set Hardware';
	constructor(public hardware: any) {}
    }
    //Аппаратные средства, выбираемые пользователем в настройках
    export class VideoHardwareAction {
	static readonly type = '[App] Set VideoHardware';
	constructor(public videoHardware: any) {}
    }
    export class AudioHardwareAction {
	static readonly type = '[App] Set AudioHardware';
	constructor(public audioHardware: any) {}
    }
    export class StartedStatusAction {
	static readonly type = '[App] Set StartedApp';
	constructor(public startedStatus: boolean) {}
    }
    export class HardwareStatusAction {
	static readonly type = '[App] Set HardwareStatus';
	constructor(public hardwareStatus: {state : boolean, result : any[]}) {}
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
    export class AppUserChangedAction {
	static readonly type = '[App] Change AppUser Data';
	constructor(public appUserChanged: Contact ) {}
    }
    export class AppPermissionsAction {
	static readonly type = '[App] Set Permissions';
	constructor(public permissions: any[]) {}
    }
    export class StunTurnConfigAction {
	static readonly type = '[App] Get Api StunTurn';
	constructor(public stunTurnConfig: any) {}
    }
    export class StunTurnAction {
	static readonly type = '[App] Get Type Stun/Turn';
	constructor(public stunTurn: string) {}
    }
    export class OptimizeCallAction {
	static readonly type = '[App] Get OptimizeCall';
	constructor(public optimizeCall: string) {}
    }
    export class CallSaveAction {
	static readonly type = '[App] Have Call Save';
	constructor(public callSave: string) {}
    }
    export class CallModeAction {
	static readonly type = '[App] Have Call Mode';
	constructor(public callMode: string) {}
    }
    export class UpdateAction {
	static readonly type = '[App] Have Update';
	constructor(public update: string) {}
    }
    export class DuplicateCallAction {
	static readonly type = '[App] Have duplicate Call';
	constructor(public duplicateCall: string) {}
    }
    export class CallTimeAction {
	static readonly type = '[App] Have Call Time';
	constructor(public callTime: string) {}
    }
    export class ContactsAction {
	static readonly type = '[App] Get Contacts';
	constructor(public contacts: Contact[]) {}
    }
    export class PopupsAction {
	static readonly type = '[App] Set Popups';
	constructor(public popups: any[]) {}
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
	constructor(public activatedContacts: Contact[]) {}
    }
    
    export class ChangeDetectorAction {
	static readonly type = '[App] Set App ChangeDetector';
	constructor(public changeDetector: ChangeDetectorRef) {}
    }

    
}

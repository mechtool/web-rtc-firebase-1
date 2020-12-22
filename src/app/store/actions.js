export var Actions;
(function (Actions) {
    class ColorThemeAction {
        constructor(appColorClass) {
            this.appColorClass = appColorClass;
        }
    }
    ColorThemeAction.type = '[App] Change ColorTheme';
    Actions.ColorThemeAction = ColorThemeAction;
    class GoogleAuthAction {
        constructor(googleAuth) {
            this.googleAuth = googleAuth;
        }
    }
    GoogleAuthAction.type = '[App] Get GoogleAuth';
    Actions.GoogleAuthAction = GoogleAuthAction;
    class ExcludeAddedAction {
        constructor(excludeAdded) {
            this.excludeAdded = excludeAdded;
        }
    }
    ExcludeAddedAction.type = '[App] Set ExcludeAdded';
    Actions.ExcludeAddedAction = ExcludeAddedAction;
    class ContactsLimitAction {
        constructor(contactsLimit) {
            this.contactsLimit = contactsLimit;
        }
    }
    ContactsLimitAction.type = '[App] Change ContactsLimit';
    Actions.ContactsLimitAction = ContactsLimitAction;
    class UpdateTypeAction {
        constructor(updateType) {
            this.updateType = updateType;
        }
    }
    UpdateTypeAction.type = '[App] Change UpdateType';
    Actions.UpdateTypeAction = UpdateTypeAction;
    class BeforeInstallAction {
        constructor(beforeInstall) {
            this.beforeInstall = beforeInstall;
        }
    }
    BeforeInstallAction.type = '[App] Change Before install';
    Actions.BeforeInstallAction = BeforeInstallAction;
    class AppUserAction {
        constructor(appUser) {
            this.appUser = appUser;
        }
    }
    AppUserAction.type = '[App] Change AppUser';
    Actions.AppUserAction = AppUserAction;
    class AppPermissionsAction {
        constructor(permissions) {
            this.permissions = permissions;
        }
    }
    AppPermissionsAction.type = '[App] Set Permissions';
    Actions.AppPermissionsAction = AppPermissionsAction;
    class ApiKeysAction {
        constructor(apiKeys) {
            this.apiKeys = apiKeys;
        }
    }
    ApiKeysAction.type = '[App] Get Api Keys';
    Actions.ApiKeysAction = ApiKeysAction;
    class StunTurnConfigAction {
        constructor(stunTurnConfig) {
            this.stunTurnConfig = stunTurnConfig;
        }
    }
    StunTurnConfigAction.type = '[App] Get Api StunTurn';
    Actions.StunTurnConfigAction = StunTurnConfigAction;
    class ContactsAction {
        constructor(contacts) {
            this.contacts = contacts;
        }
    }
    ContactsAction.type = '[App] Get Contacts';
    Actions.ContactsAction = ContactsAction;
    class UsersAction {
        constructor(users) {
            this.users = users;
        }
    }
    UsersAction.type = '[App] Get Users';
    Actions.UsersAction = UsersAction;
    class MessagesAction {
        constructor(messages) {
            this.messages = messages;
        }
    }
    MessagesAction.type = '[App] Get Messages';
    Actions.MessagesAction = MessagesAction;
    class AnnouncementsAction {
        constructor(announcements) {
            this.announcements = announcements;
        }
    }
    AnnouncementsAction.type = '[App] Get Announcements';
    Actions.AnnouncementsAction = AnnouncementsAction;
    class OnLineAction {
        constructor(online) {
            this.online = online;
        }
    }
    OnLineAction.type = '[App] Set Online';
    Actions.OnLineAction = OnLineAction;
    class ActivatedContactsAction {
        constructor(activatedContacts) {
            this.activatedContacts = activatedContacts;
        }
    }
    ActivatedContactsAction.type = '[App] Set ActivatedContacts';
    Actions.ActivatedContactsAction = ActivatedContactsAction;
})(Actions || (Actions = {}));

import * as tslib_1 from "tslib";
import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule } from "@angular/router";
var routes = [
    { path: "", loadChildren: "./tabs/tabs.module#TabsPageModule" },
    { path: "auth", loadChildren: "./auth/auth.module#AuthPageModule" },
    {
        path: "contacts",
        loadChildren: "./contacts/contacts.module#ContactsPageModule"
    },
    { path: "user", loadChildren: "./user/user.module#UserPageModule" },
    {
        path: "messages",
        loadChildren: "./messages/messages.module#MessagesPageModule"
    },
    {
        path: "message",
        loadChildren: "./message/message.module#MessagePageModule"
    },
    {
        path: "teleport",
        loadChildren: "./teleport/teleport.module#TeleportPageModule"
    },
    {
        path: "select-contact-to-message",
        loadChildren: "./select-contact-to-message/select-contact-to-message.module#SelectContactToMessagePageModule"
    },
    {
        path: "create-new-event",
        loadChildren: "./create-new-event/create-new-event.module#CreateNewEventPageModule"
    },
    {
        path: "add-contact",
        loadChildren: "./add-contact/add-contact.module#AddContactPageModule"
    },
    {
        path: "my-settings",
        loadChildren: "./my-settings/my-settings.module#MySettingsPageModule"
    },
    {
        path: "create-new-item",
        loadChildren: "./create-new-item/create-new-item.module#CreateNewItemPageModule"
    },
    {
        path: "event-registration",
        loadChildren: "./event-registration/event-registration.module#EventRegistrationPageModule"
    },
    { path: 'teleport', loadChildren: './teleport/teleport.module#TeleportPageModule' },
    { path: 'user-card', loadChildren: './user-card/user-card.module#UserCardPageModule' }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
            ],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map
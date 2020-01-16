import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
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
    loadChildren:
      "./select-contact-to-message/select-contact-to-message.module#SelectContactToMessagePageModule"
  },
  {
    path: "create-new-event",
    loadChildren:
      "./create-new-event/create-new-event.module#CreateNewEventPageModule"
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
    loadChildren:
      "./create-new-item/create-new-item.module#CreateNewItemPageModule"
  },
  {
    path: "event-registration",
    loadChildren:
      "./event-registration/event-registration.module#EventRegistrationPageModule"
  },
  { path: 'teleport', loadChildren: './teleport/teleport.module#TeleportPageModule' },
  { path: 'user-card', loadChildren: './user-card/user-card.module#UserCardPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  {
    path: "",
    loadChildren: "./tabs/tabs.module#TabsPageModule"
  },
  {
    path: "auth",
    loadChildren: "./auth/auth.module#AuthPageModule"
  },
  {
    path: "contacts",
    loadChildren: "./contacts/contacts.module#ContactsPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "user",
    loadChildren: "./user/user.module#UserPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "messages",
    loadChildren: "./messages/messages.module#MessagesPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "message",
    loadChildren: "./message/message.module#MessagePageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "teleport",
    loadChildren: "./teleport/teleport.module#TeleportPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "select-contact-to-message",
    loadChildren:
      "./select-contact-to-message/select-contact-to-message.module#SelectContactToMessagePageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "create-new-event",
    loadChildren:
      "./create-new-event/create-new-event.module#CreateNewEventPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "add-contact",
    loadChildren: "./add-contact/add-contact.module#AddContactPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "my-settings",
    loadChildren: "./my-settings/my-settings.module#MySettingsPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "create-new-item",
    loadChildren:
      "./create-new-item/create-new-item.module#CreateNewItemPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "event-registration",
    loadChildren:
      "./event-registration/event-registration.module#EventRegistrationPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "teleport",
    loadChildren: "./teleport/teleport.module#TeleportPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "user-card",
    loadChildren: "./user-card/user-card.module#UserCardPageModule",
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

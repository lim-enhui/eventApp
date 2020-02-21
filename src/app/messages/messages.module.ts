import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { MessagesPage } from "./messages.page";
import { getRecipientPipe } from "./recipient.pipe";

const routes: Routes = [
  {
    path: "",
    component: MessagesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MessagesPage, getRecipientPipe]
})
export class MessagesPageModule {}

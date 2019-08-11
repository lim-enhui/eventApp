import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ContactsPage } from "./contacts.page";
import { PopoverComponent } from "src/component/popover/popover.component";

const routes: Routes = [
  {
    path: "",
    component: ContactsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [PopoverComponent],
  declarations: [ContactsPage, PopoverComponent]
})
export class ContactsPageModule {}

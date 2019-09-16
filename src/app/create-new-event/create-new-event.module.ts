import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { CreateNewEventPage } from "./create-new-event.page";
import { Ionic4DatepickerModule } from "@logisticinfotech/ionic4-datepicker";

const routes: Routes = [
  {
    path: "",
    component: CreateNewEventPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    Ionic4DatepickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreateNewEventPage]
})
export class CreateNewEventPageModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { EventRegistrationPage } from "./event-registration.page";
import { AgmCoreModule } from "@agm/core";

const routes: Routes = [
  {
    path: "",
    component: EventRegistrationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyC8ARJENkIiYflB87N6i3saTjJuaPdKvTQ"
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [EventRegistrationPage]
})
export class EventRegistrationPageModule {}

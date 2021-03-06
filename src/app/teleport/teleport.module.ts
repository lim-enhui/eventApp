import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { AgmCoreModule } from "@agm/core";
import { IonicModule } from "@ionic/angular";

import { TeleportPage } from "./teleport.page";

import { GeolocationService } from "../shared/geolocation.service";

const routes: Routes = [
  {
    path: "",
    component: TeleportPage
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
  providers: [GeolocationService],
  declarations: [TeleportPage]
})
export class TeleportPageModule {}

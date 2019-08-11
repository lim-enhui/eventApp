import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { UserPage } from "./user.page";
import { QrCodePage } from "../qr-code/qr-code.page";
import { QRCodeModule } from "angularx-qrcode";

const routes: Routes = [
  {
    path: "",
    component: UserPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QRCodeModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [QrCodePage],
  declarations: [UserPage, QrCodePage]
})
export class UserPageModule {}

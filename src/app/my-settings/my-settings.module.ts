import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { FileChooser } from "@ionic-native/file-chooser/ngx";

import { IonicModule } from "@ionic/angular";

import { MySettingsPage } from "./my-settings.page";

const routes: Routes = [
  {
    path: "",
    component: MySettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [FileChooser],
  declarations: [MySettingsPage]
})
export class MySettingsPageModule {}

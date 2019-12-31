import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { CreateNewItemPage } from "./create-new-item.page";
import { NativeHelpersService } from "../shared/native-helpers.service";

const routes: Routes = [
  {
    path: "",
    component: CreateNewItemPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreateNewItemPage],
  providers: [NativeHelpersService]
})
export class CreateNewItemPageModule {}

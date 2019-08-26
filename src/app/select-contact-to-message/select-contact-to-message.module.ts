import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SelectContactToMessagePage } from './select-contact-to-message.page';

const routes: Routes = [
  {
    path: '',
    component: SelectContactToMessagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SelectContactToMessagePage]
})
export class SelectContactToMessagePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AuthGuard } from '../auth/auth.guard';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: '../home/home.module#HomePageModule',
            canLoad:[AuthGuard]
          }
        ]
      },
      {
        path: 'qr-scanner',
        children: [
          {
            path: '',
            loadChildren: '../qr-scanner/qr-scanner.module#QrScannerPageModule',
            canLoad:[AuthGuard]
          }
        ]
      },
      {
        path: 'my-folder',
        children: [
          {
            path: '',
            loadChildren: '../my-folder/my-folder.module#MyFolderPageModule',
            canLoad:[AuthGuard]
          }
        ]
      },
      {
        path: 'my-settings',
        children: [
          {
            path: '',
            loadChildren: '../my-settings/my-settings.module#MySettingsPageModule',
            canLoad:[AuthGuard]
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
        canLoad:[AuthGuard]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
    canLoad:[AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}

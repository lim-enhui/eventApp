import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MyFolderPage } from './my-folder.page';
var routes = [
    {
        path: '',
        component: MyFolderPage
    }
];
var MyFolderPageModule = /** @class */ (function () {
    function MyFolderPageModule() {
    }
    MyFolderPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [
                MyFolderPage
            ]
        })
    ], MyFolderPageModule);
    return MyFolderPageModule;
}());
export { MyFolderPageModule };
//# sourceMappingURL=my-folder.module.js.map
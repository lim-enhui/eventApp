import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddContactPage } from './add-contact.page';
var routes = [
    {
        path: '',
        component: AddContactPage
    }
];
var AddContactPageModule = /** @class */ (function () {
    function AddContactPageModule() {
    }
    AddContactPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [AddContactPage]
        })
    ], AddContactPageModule);
    return AddContactPageModule;
}());
export { AddContactPageModule };
//# sourceMappingURL=add-contact.module.js.map
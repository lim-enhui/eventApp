import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SelectContactToMessagePage } from './select-contact-to-message.page';
var routes = [
    {
        path: '',
        component: SelectContactToMessagePage
    }
];
var SelectContactToMessagePageModule = /** @class */ (function () {
    function SelectContactToMessagePageModule() {
    }
    SelectContactToMessagePageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [SelectContactToMessagePage]
        })
    ], SelectContactToMessagePageModule);
    return SelectContactToMessagePageModule;
}());
export { SelectContactToMessagePageModule };
//# sourceMappingURL=select-contact-to-message.module.js.map
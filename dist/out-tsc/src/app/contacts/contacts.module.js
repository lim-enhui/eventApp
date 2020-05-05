import * as tslib_1 from "tslib";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { ContactsPage } from "./contacts.page";
import { PopoverComponent } from "src/component/popover/popover.component";
var routes = [
    {
        path: "",
        component: ContactsPage
    }
];
var ContactsPageModule = /** @class */ (function () {
    function ContactsPageModule() {
    }
    ContactsPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            entryComponents: [PopoverComponent],
            declarations: [ContactsPage, PopoverComponent]
        })
    ], ContactsPageModule);
    return ContactsPageModule;
}());
export { ContactsPageModule };
//# sourceMappingURL=contacts.module.js.map
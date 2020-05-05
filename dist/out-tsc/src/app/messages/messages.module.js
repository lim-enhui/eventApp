import * as tslib_1 from "tslib";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { MessagesPage } from "./messages.page";
import { getRecipientPipe } from "./recipient.pipe";
var routes = [
    {
        path: "",
        component: MessagesPage
    }
];
var MessagesPageModule = /** @class */ (function () {
    function MessagesPageModule() {
    }
    MessagesPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [MessagesPage, getRecipientPipe]
        })
    ], MessagesPageModule);
    return MessagesPageModule;
}());
export { MessagesPageModule };
//# sourceMappingURL=messages.module.js.map
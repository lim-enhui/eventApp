import * as tslib_1 from "tslib";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { MessagePage } from "./message.page";
var routes = [
    {
        path: ":id",
        component: MessagePage
    }
];
var MessagePageModule = /** @class */ (function () {
    function MessagePageModule() {
    }
    MessagePageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [MessagePage]
        })
    ], MessagePageModule);
    return MessagePageModule;
}());
export { MessagePageModule };
//# sourceMappingURL=message.module.js.map
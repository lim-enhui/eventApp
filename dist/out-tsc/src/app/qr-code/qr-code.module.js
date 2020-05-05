import * as tslib_1 from "tslib";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { QrCodePage } from "./qr-code.page";
var routes = [
    {
        path: "",
        component: QrCodePage
    }
];
var QrCodePageModule = /** @class */ (function () {
    function QrCodePageModule() {
    }
    QrCodePageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [QrCodePage]
        })
    ], QrCodePageModule);
    return QrCodePageModule;
}());
export { QrCodePageModule };
//# sourceMappingURL=qr-code.module.js.map
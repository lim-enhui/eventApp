import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { QrScannerPage } from './qr-scanner.page';
var routes = [
    {
        path: '',
        component: QrScannerPage
    }
];
var QrScannerPageModule = /** @class */ (function () {
    function QrScannerPageModule() {
    }
    QrScannerPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [QrScannerPage]
        })
    ], QrScannerPageModule);
    return QrScannerPageModule;
}());
export { QrScannerPageModule };
//# sourceMappingURL=qr-scanner.module.js.map
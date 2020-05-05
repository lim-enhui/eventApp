import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
var QrCodePage = /** @class */ (function () {
    function QrCodePage(modalController, navParams) {
        this.modalController = modalController;
        this.navParams = navParams;
    }
    QrCodePage.prototype.ngOnInit = function () {
        console.log(this.navParams);
        var item = this.navParams.get("item");
        this.scannedItem = JSON.stringify(item);
    };
    QrCodePage.prototype.dismiss = function () {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
            dismissed: true
        });
    };
    QrCodePage = tslib_1.__decorate([
        Component({
            selector: "app-qr-code",
            templateUrl: "./qr-code.page.html",
            styleUrls: ["./qr-code.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController,
            NavParams])
    ], QrCodePage);
    return QrCodePage;
}());
export { QrCodePage };
//# sourceMappingURL=qr-code.page.js.map
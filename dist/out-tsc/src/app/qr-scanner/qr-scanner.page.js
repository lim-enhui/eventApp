import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { ActionSheetController, Platform, ModalController, NavController } from "@ionic/angular";
import { QRScanner } from "@ionic-native/qr-scanner/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { File } from "@ionic-native/file/ngx";
import { Router } from "@angular/router";
import { sleeper, tryParseJSON } from "../utils/utils";
import { NativeHelpersService } from "../shared/native-helpers.service";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import { UserCardPage } from "../user-card/user-card.page";
var QrScannerPage = /** @class */ (function () {
    function QrScannerPage(platform, qrScanner, actionSheetController, nativeHelpersService, store, router, navCtrl, afs, fileOpener, transfer, file, modalController) {
        this.platform = platform;
        this.qrScanner = qrScanner;
        this.actionSheetController = actionSheetController;
        this.nativeHelpersService = nativeHelpersService;
        this.store = store;
        this.router = router;
        this.navCtrl = navCtrl;
        this.afs = afs;
        this.fileOpener = fileOpener;
        this.transfer = transfer;
        this.file = file;
        this.modalController = modalController;
        this.isQRScanning = false;
        // public reInitProcessNextActionSheet: boolean = false;
        this.isFlashLightOn = false;
        this.fileTransfer = this.transfer.create();
    }
    QrScannerPage.prototype.showCamera = function () {
        window.document.querySelector("html").classList.add("cameraView");
    };
    QrScannerPage.prototype.hideCamera = function () {
        window.document.querySelector("html").classList.remove("cameraView");
    };
    QrScannerPage.prototype.openScannedItem = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var uri, locale_file;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("dispatch loading true and is downloading");
                        if (!(item.type !== "youtube")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.nativeHelpersService.downloadFileHelper(item)];
                    case 1:
                        uri = _a.sent();
                        locale_file = uri.toURL();
                        _a.label = 2;
                    case 2:
                        switch (item.type) {
                            case "powerpoint":
                                this.fileOpener
                                    .open(locale_file, "application/vnd.openxmlformats-officedocument.presentationml.presentation")
                                    .then(function () { return console.log("File is opened"); })
                                    .catch(function (e) { return console.log("Error opening file", e); });
                                break;
                            case "document":
                                this.fileOpener
                                    .open(locale_file, "application/pdf")
                                    .then(function () { return console.log("File is opened"); })
                                    .catch(function (e) { return console.log("Error opening file", e); });
                                break;
                            case "image":
                                this.fileOpener
                                    .open(locale_file, "image/" + item.format)
                                    .then(function () { return console.log("File is opened"); })
                                    .catch(function (e) { return console.log("Error opening file", e); });
                                break;
                            case "youtube":
                                this.nativeHelpersService.openYoutubeApp(item.value);
                                break;
                            default:
                        }
                        // const ref = this.storage.ref("test.jpeg");
                        // const uri = await ref.getDownloadURL().toPromise();
                        this.fileTransfer
                            .download(uri, this.file.dataDirectory + "test.jpeg")
                            .then(function (entry) {
                            var locale_file = entry.toURL();
                            console.log("download complete: " + locale_file);
                            console.log("dispatch loading false");
                            _this.fileOpener
                                .open(locale_file, "image/jpeg")
                                .then(function () {
                                console.log("File is opened");
                            })
                                .catch(function (e) { return console.log("Error opening file", e); });
                        }, function (error) {
                            throw Error("Unable to download file.");
                        })
                            .then(function () {
                            sleeper(2000);
                        })
                            .then(function () {
                            _this.presentProcessNextActionSheet(item);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    QrScannerPage.prototype.openContactCard = function (item) {
        var _this = this;
        // alert("Contact");
        console.log(item);
        // this.router.navigate(["/user-card/" + item.id]);
        this.presentModal(item).then(function (modaldata) {
            if (modaldata.data.boolNavigateToMessage) {
                _this.navigateTo(modaldata.data.url);
            }
            else {
                _this.presentProcessNextActionSheet(item);
            }
        });
    };
    QrScannerPage.prototype.presentModal = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: UserCardPage,
                            componentProps: {
                                item: {
                                    id: item.id
                                }
                            }
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, modal.onWillDismiss()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    QrScannerPage.prototype.presentProcessNextActionSheet = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var actionSheet;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.actionSheetController.create({
                            header: "Collection",
                            backdropDismiss: false,
                            buttons: [
                                {
                                    text: "Open",
                                    icon: "open",
                                    handler: function () {
                                        console.log("open clicked");
                                        if (item.type !== "contact") {
                                            _this.openScannedItem(item);
                                        }
                                        else {
                                            _this.openContactCard(item);
                                        }
                                        actionSheet.dismiss();
                                    }
                                },
                                {
                                    text: "Rescan",
                                    icon: "arrow-dropright-circle",
                                    handler: function () {
                                        console.log("Rescan clicked");
                                        console.log("should scan");
                                        actionSheet.dismiss();
                                        _this.showCamera();
                                        _this.initQRScanner();
                                    }
                                },
                                {
                                    text: item.type === "contact" ? "Add Contact" : "Add to Collection",
                                    icon: item.type === "contact" ? "contact" : "bookmark",
                                    handler: function () {
                                        console.log("Add to Collection clicked");
                                        if (item.type !== "contact") {
                                            _this.afs.doc("users/" + _this.userId + "/private/inventory").update({
                                                items: firebase.firestore.FieldValue.arrayUnion(item.id)
                                            });
                                            actionSheet.dismiss();
                                            _this.router.navigateByUrl("/tabs/my-folder");
                                        }
                                        else {
                                            _this.afs.firestore
                                                .doc("users/" + _this.userId + "/private/contacts")
                                                .get()
                                                .then(function (docSnapshot) {
                                                if (docSnapshot.exists) {
                                                    _this.afs
                                                        .doc("users/" + _this.userId + "/private/contacts")
                                                        .update({
                                                        users: firebase.firestore.FieldValue.arrayUnion(item.id)
                                                    });
                                                }
                                                else {
                                                    _this.afs.doc("users/" + _this.userId + "/private/contacts").set({
                                                        users: firebase.firestore.FieldValue.arrayUnion(item.id)
                                                    });
                                                }
                                                _this.router.navigateByUrl("/tabs/home");
                                            });
                                        }
                                    }
                                },
                                {
                                    text: "Cancel",
                                    icon: "close",
                                    role: "cancel",
                                    handler: function () {
                                        console.log("Cancel clicked");
                                        actionSheet.dismiss();
                                        _this.router.navigateByUrl("/tabs/home");
                                    }
                                }
                            ]
                        })];
                    case 1:
                        actionSheet = _a.sent();
                        return [4 /*yield*/, actionSheet.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    QrScannerPage.prototype.presentScanAgainActionSheet = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var actionSheet;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.actionSheetController.create({
                            header: "Collection",
                            backdropDismiss: false,
                            buttons: [
                                {
                                    text: "Rescan",
                                    icon: "arrow-dropright-circle",
                                    handler: function () {
                                        console.log("Rescan clicked");
                                        console.log("should scan");
                                        actionSheet.dismiss();
                                        _this.showCamera();
                                        _this.initQRScanner();
                                    }
                                }
                            ]
                        })];
                    case 1:
                        actionSheet = _a.sent();
                        return [4 /*yield*/, actionSheet.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    QrScannerPage.prototype.ionViewWillEnter = function () {
        console.log("ionViewWillEnter");
        this.showCamera();
        this.initQRScanner();
    };
    QrScannerPage.prototype.initQRScanner = function () {
        var _this = this;
        this.qrScanner
            .prepare()
            .then(function (status) {
            if (status.authorized) {
                _this.isQRScanning = true;
                // start scanning
                var scanSub_1 = _this.qrScanner.scan().subscribe(function (text) {
                    console.log("Scanned something", text);
                    var scannedItem = tryParseJSON(text);
                    if (scannedItem === false) {
                        _this.presentScanAgainActionSheet();
                    }
                    else {
                        console.log(scannedItem);
                        _this.isQRScanning = false;
                        _this.presentProcessNextActionSheet(scannedItem);
                        _this.qrScanner.hide();
                        scanSub_1.unsubscribe();
                    }
                });
                _this.qrScanner.show();
            }
            else if (status.denied) {
                // camera permission was permanently denied
                // you must use QRScanner.openSettings() method to guide the user to the settings page
                // then they can grant the permission from there
                _this.qrScanner.openSettings();
            }
            else {
                // permission was denied, but not permanently. You can ask for permission again at a later time.
            }
        })
            .catch(function (e) { return console.log("Error is", e); });
    };
    QrScannerPage.prototype.ngOnInit = function () {
        var _this = this;
        this.store
            .pipe(select(fromAppReducer.selectUserId))
            .subscribe(function (userId) { return (_this.userId = userId); });
    };
    QrScannerPage.prototype.toggleFlashLight = function () {
        this.isFlashLightOn = !this.isFlashLightOn;
        if (this.isFlashLightOn) {
            this.qrScanner.enableLight();
        }
        else {
            this.qrScanner.disableLight();
        }
    };
    QrScannerPage.prototype.ionViewWillLeave = function () {
        console.log("ionViewWillLeave");
        this.qrScanner.pausePreview();
        this.qrScanner.hide();
        this.hideCamera();
    };
    QrScannerPage.prototype.ionViewDidLeave = function () {
        console.log("ionViewDidLeave");
    };
    QrScannerPage.prototype.navigateTo = function (url) {
        this.navCtrl.navigateForward("/" + url);
    };
    QrScannerPage = tslib_1.__decorate([
        Component({
            selector: "app-qr-scanner",
            templateUrl: "./qr-scanner.page.html",
            styleUrls: ["./qr-scanner.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [Platform,
            QRScanner,
            ActionSheetController,
            NativeHelpersService,
            Store,
            Router,
            NavController,
            AngularFirestore,
            FileOpener,
            FileTransfer,
            File,
            ModalController])
    ], QrScannerPage);
    return QrScannerPage;
}());
export { QrScannerPage };
//# sourceMappingURL=qr-scanner.page.js.map
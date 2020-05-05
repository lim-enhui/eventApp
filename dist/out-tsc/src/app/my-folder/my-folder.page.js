import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { LoadingController, ToastController, ActionSheetController, ModalController, NavController } from "@ionic/angular";
import { AngularFireStorage } from "@angular/fire/storage";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import * as firebase from "firebase";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import { AngularFirestore } from "@angular/fire/firestore";
import { itemsJoin } from "../utils/utils";
import { QrCodePage } from "../qr-code/qr-code.page";
import { NativeHelpersService } from "../shared/native-helpers.service";
var MyFolderPage = /** @class */ (function () {
    function MyFolderPage(loadingController, storage, fileOpener, transfer, file, afs, nativeHelpersService, toastController, store, actionSheetController, modalController, socialSharing, navController) {
        this.loadingController = loadingController;
        this.storage = storage;
        this.fileOpener = fileOpener;
        this.transfer = transfer;
        this.file = file;
        this.afs = afs;
        this.nativeHelpersService = nativeHelpersService;
        this.toastController = toastController;
        this.store = store;
        this.actionSheetController = actionSheetController;
        this.modalController = modalController;
        this.socialSharing = socialSharing;
        this.navController = navController;
        this.currentDate = new Date();
        this.yesterdayDate = new Date();
        this.fileTransfer = this.transfer.create();
        this.yesterdayDate.setDate(this.currentDate.getDate() - 1);
    }
    MyFolderPage.prototype.ngOnInit = function () { };
    MyFolderPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.filter = "recent";
        this.presentLoading();
        this.store
            .pipe(select(fromAppReducer.selectUserId))
            .subscribe(function (userId) { return (_this.userId = userId); });
        this.store.pipe(select(fromAppReducer.selectUserId)).subscribe(function (userId) {
            _this.userId = userId;
            _this.afs.firestore
                .doc("users/" + userId + "/private/inventory")
                .get()
                .then(function (docSnapshot) {
                if (docSnapshot.exists) {
                    // do something
                    _this.loadItems();
                }
                else {
                    console.log("does not exist");
                    _this.isLoading.dismiss();
                    _this.itemFiles = [];
                }
            });
        });
    };
    MyFolderPage.prototype.loadItems = function () {
        var _this = this;
        this.afs
            .doc("users/" + this.userId + "/private/inventory")
            .valueChanges()
            .pipe(itemsJoin(this.afs))
            .subscribe(function (files) {
            _this.isLoading.dismiss();
            _this.itemFiles = files;
        });
    };
    MyFolderPage.prototype.iconType = function (type) {
        switch (type) {
            case "image":
                return "image";
            case "document":
                return "document";
            case "powerpoint":
                return "easel";
            default:
                return "play";
        }
    };
    MyFolderPage.prototype.dlOpenImageFile = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var uri, locale_file;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nativeHelpersService.downloadFileHelper(item)];
                    case 1:
                        uri = _a.sent();
                        locale_file = uri.toURL();
                        console.log("download complete: " + locale_file);
                        this.fileOpener
                            .open(locale_file, "image/" + item.format)
                            .then(function () { return _this.isLoading.dismiss(); })
                            .catch(function (e) { return _this.isLoading.dismiss(); });
                        return [2 /*return*/];
                }
            });
        });
    };
    MyFolderPage.prototype.dlOpenPdfFile = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var uri, locale_file;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nativeHelpersService.downloadFileHelper(item)];
                    case 1:
                        uri = _a.sent();
                        locale_file = uri.toURL();
                        console.log("download complete: " + locale_file);
                        this.fileOpener
                            .open(locale_file, "application/pdf")
                            .then(function () { return _this.isLoading.dismiss(); })
                            .catch(function (e) { return _this.isLoading.dismiss(); });
                        return [2 /*return*/];
                }
            });
        });
    };
    MyFolderPage.prototype.presentLoading = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.loadingController.create({
                                spinner: "circular",
                                message: "Loading Content. Please wait...",
                                translucent: true,
                                cssClass: "loading-width extent-content"
                            })];
                    case 1:
                        _a.isLoading = _b.sent();
                        return [4 /*yield*/, this.isLoading.present()];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    MyFolderPage.prototype.openYoutubeApp = function (item) {
        this.nativeHelpersService.openYoutubeApp(item.value);
    };
    MyFolderPage.prototype.openItem = function (item) {
        console.log(item);
        switch (item.type) {
            case "powerpoint":
                this.presentToast(true);
                this.dlOpenPptxFile(item);
                break;
            case "document":
                this.presentToast(true);
                this.dlOpenPdfFile(item);
                break;
            case "image":
                this.presentToast(true);
                this.dlOpenImageFile(item);
                break;
            case "youtube":
                this.openYoutubeApp(item);
                break;
            default:
                this.presentToast(false);
        }
    };
    MyFolderPage.prototype.deleteItem = function (item) {
        this.afs.doc("users/" + this.userId + "/private/inventory").update({
            items: firebase.firestore.FieldValue.arrayRemove(item.id)
        });
    };
    MyFolderPage.prototype.presentToast = function (supported) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!supported) return [3 /*break*/, 1];
                        this.presentLoading();
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.toastController.create({
                            header: "Error",
                            message: "Fail to open the application",
                            position: "bottom",
                            buttons: [
                                {
                                    text: "Close",
                                    role: "cancel",
                                    handler: function () {
                                        console.log("Cancel clicked");
                                    }
                                }
                            ]
                        })];
                    case 2:
                        toast = _a.sent();
                        _a.label = 3;
                    case 3:
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    MyFolderPage.prototype.dlOpenPptxFile = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var uri, locale_file;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nativeHelpersService.downloadFileHelper(item)];
                    case 1:
                        uri = _a.sent();
                        locale_file = uri.toURL();
                        console.log("download complete: " + locale_file);
                        this.fileOpener
                            .open(locale_file, "application/vnd.openxmlformats-officedocument.presentationml.presentation")
                            .then(function () { return _this.isLoading.dismiss(); })
                            .catch(function (e) { return _this.isLoading.dismiss(); });
                        return [2 /*return*/];
                }
            });
        });
    };
    MyFolderPage.prototype.navigatePush = function (page) {
        this.navController.navigateForward("/" + page);
    };
    MyFolderPage.prototype.presentModal = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: QrCodePage,
                            componentProps: { item: item }
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MyFolderPage.prototype.shareByEmail = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref, uri, entry, locale_file;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ref = this.storage.ref(item.name + "_" + item.createdAt + "." + item.format);
                        return [4 /*yield*/, ref.getDownloadURL().toPromise()];
                    case 1:
                        uri = _a.sent();
                        return [4 /*yield*/, this.fileTransfer.download(uri, this.file.dataDirectory + (item.name + "_" + item.createdAt + "." + item.format))];
                    case 2:
                        entry = _a.sent();
                        locale_file = entry.toURL();
                        // Check if sharing via email is supported
                        this.socialSharing
                            .canShareViaEmail()
                            .then(function () {
                            // Sharing via email is possible
                            // Share via email
                            console.log("can share by email");
                            _this.socialSharing
                                .shareViaEmail("The items is shared via eventApp", "", [""], [""], [""], locale_file)
                                .then(function () {
                                // Success!
                                console.log("sucess stage");
                            })
                                .catch(function () {
                                // Error!
                                console.error("failed");
                                _this.presentToast(false);
                            });
                        })
                            .catch(function () {
                            // Sharing via email is not possible
                            console.error("error");
                            _this.presentToast(false);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    MyFolderPage.prototype.shareByWhatsapp = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref, uri, entry, locale_file_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(item.type === "youtube")) return [3 /*break*/, 1];
                        this.socialSharing
                            .canShareVia("whatsapp")
                            .then(function () {
                            // Sharing via email is possible
                            // Share via email
                            _this.socialSharing
                                .shareViaWhatsApp("Share by eventApp", "", item.url)
                                .then(function () {
                                // Success!
                                console.log("sucess stage");
                            })
                                .catch(function () {
                                // Error!
                                _this.presentToast(false);
                                console.error("failed");
                            });
                        })
                            .catch(function () {
                            // Sharing via email is not possible
                            _this.presentToast(false);
                            console.error("error");
                        });
                        return [3 /*break*/, 4];
                    case 1:
                        console.log(item);
                        ref = this.storage.ref(item.name + "_" + item.createdAt + "." + item.format);
                        return [4 /*yield*/, ref.getDownloadURL().toPromise()];
                    case 2:
                        uri = _a.sent();
                        return [4 /*yield*/, this.fileTransfer.download(uri, this.file.dataDirectory +
                                (item.name + "_" + item.createdAt + "." + item.format))];
                    case 3:
                        entry = _a.sent();
                        locale_file_1 = entry.toURL();
                        this.socialSharing
                            .canShareVia("whatsapp")
                            .then(function () {
                            // Sharing via email is possible
                            // Share via email
                            _this.socialSharing
                                .shareViaWhatsApp("Share by eventApp", locale_file_1)
                                .then(function () {
                                // Success!
                                console.log("sucess stage");
                            })
                                .catch(function () {
                                // Error!
                                _this.presentToast(false);
                                console.error("failed");
                            });
                        })
                            .catch(function () {
                            // Sharing via email is not possible
                            _this.presentToast(false);
                            console.error("error");
                        });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MyFolderPage.prototype.presentActionSheet = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var actionSheet;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.actionSheetController.create({
                            header: "Share Options",
                            buttons: [
                                {
                                    text: "QR Code",
                                    icon: "barcode",
                                    handler: function () {
                                        _this.presentModal(item);
                                    }
                                },
                                {
                                    text: "Email",
                                    icon: "mail",
                                    handler: function () {
                                        console.log("Share clicked");
                                        _this.shareByEmail(item);
                                    }
                                },
                                {
                                    text: "Whatsapp",
                                    icon: "logo-whatsapp",
                                    handler: function () {
                                        console.log("Play clicked");
                                        _this.shareByWhatsapp(item);
                                    }
                                },
                                {
                                    text: "Cancel",
                                    icon: "close",
                                    role: "cancel",
                                    handler: function () {
                                        console.log("Cancel clicked");
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
    MyFolderPage = tslib_1.__decorate([
        Component({
            selector: "app-my-folder",
            templateUrl: "./my-folder.page.html",
            styleUrls: ["./my-folder.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [LoadingController,
            AngularFireStorage,
            FileOpener,
            FileTransfer,
            File,
            AngularFirestore,
            NativeHelpersService,
            ToastController,
            Store,
            ActionSheetController,
            ModalController,
            SocialSharing,
            NavController])
    ], MyFolderPage);
    return MyFolderPage;
}());
export { MyFolderPage };
//# sourceMappingURL=my-folder.page.js.map
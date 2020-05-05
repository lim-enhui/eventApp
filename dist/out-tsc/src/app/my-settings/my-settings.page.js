import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "../auth/auth.service";
import { map } from "rxjs/operators";
import { NativeHelpersService } from "../shared/native-helpers.service";
import * as firebase from "firebase";
import { ToastController } from "@ionic/angular";
import * as fromAppReducer from "../store/app.reducer";
import { Store, select } from "@ngrx/store";
import { FcmService } from "../shared/fcm.service";
var MySettingsPage = /** @class */ (function () {
    function MySettingsPage(store, afs, auth, nativeHelpersService, toastController, fcmService) {
        this.store = store;
        this.afs = afs;
        this.auth = auth;
        this.nativeHelpersService = nativeHelpersService;
        this.toastController = toastController;
        this.fcmService = fcmService;
        this.userIsSearchable = false;
        this.attachedImage = false;
        this.dateLog = Date.now();
        this.notificationIsEnabled = false;
        this.deviceToken = "";
    }
    MySettingsPage.prototype.ngOnInit = function () {
        var _this = this;
        this.store
            .pipe(select(fromAppReducer.selectDeviceToken))
            .subscribe(function (token) {
            console.log("device token");
            console.log(token);
            _this.deviceToken = token;
        });
        this.auth.userId
            .pipe(map(function (userId) {
            _this.userId = userId;
        }))
            .subscribe(function () {
            _this.userDoc = _this.afs.doc("users/" + _this.userId);
            _this.searchUserDoc = _this.afs.doc("search/" + _this.userId);
            _this.searchUserDoc
                .get()
                .toPromise()
                .then(function (docSnapshot) {
                if (!docSnapshot.exists) {
                    _this.userIsSearchable = false;
                }
                else {
                    _this.userIsSearchable = true;
                }
            });
            _this.userDoc.valueChanges().subscribe(function (userData) {
                var displayName = userData.displayName, phoneNumber = userData.phoneNumber, photoUrl = userData.photoUrl, email = userData.email, occupation = userData.occupation, company_school = userData.company_school, notificationIsEnabled = userData.notificationIsEnabled;
                _this.notificationIsEnabled = notificationIsEnabled ? true : false;
                _this.userImage =
                    photoUrl === "" ? "assets/img/default_profile.jpg" : photoUrl;
                _this.userDisplayName =
                    displayName === null ||
                        displayName === undefined ||
                        displayName === ""
                        ? ""
                        : displayName;
                _this.userPhoneNumber =
                    phoneNumber === null ||
                        phoneNumber === undefined ||
                        phoneNumber === "null" ||
                        phoneNumber === ""
                        ? ""
                        : phoneNumber.toString();
                _this.userEmail =
                    email === null ||
                        email === undefined ||
                        email === "null" ||
                        email === ""
                        ? ""
                        : email;
                _this.userCompanySchool =
                    company_school === null ||
                        company_school === undefined ||
                        company_school === "null" ||
                        company_school === ""
                        ? ""
                        : company_school;
                _this.userOccupation =
                    occupation === null ||
                        occupation === undefined ||
                        occupation === "null" ||
                        occupation === ""
                        ? ""
                        : occupation;
            });
        });
    };
    MySettingsPage.prototype.updateInput = function (event, field) {
        switch (field) {
            case "userDisplayName": {
                this.userDisplayName = event.detail.value;
                break;
            }
            case "userPhoneNumber": {
                this.userPhoneNumber = event.detail.value;
                break;
            }
            case "userEmail": {
                this.userEmail = event.detail.value;
                break;
            }
            case "userCompanySchool": {
                this.userCompanySchool = event.detail.value;
                break;
            }
            case "userOccupation": {
                this.userOccupation = event.detail.value;
                break;
            }
            default: {
                break;
            }
        }
    };
    MySettingsPage.prototype.searchableToggle = function (event) {
        this.userIsSearchable = event.detail.checked;
    };
    MySettingsPage.prototype.notificationToggle = function (event) {
        this.notificationIsEnabled = event.detail.checked;
    };
    MySettingsPage.prototype.uploadTask = function (blobInfo) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _uploadFileName, uploadTask;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _uploadFileName =
                            this.userId + "_" + this.dateLog + "." + this.selectedImageFileFormat;
                        return [4 /*yield*/, firebase
                                .storage()
                                .ref()
                                .child("" + _uploadFileName)
                                .put(blobInfo.fileBlob)];
                    case 1:
                        uploadTask = _a.sent();
                        return [2 /*return*/, uploadTask.ref.getDownloadURL()];
                }
            });
        });
    };
    MySettingsPage.prototype.addImageFromDevice = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, selectedImageFile, selectedViewImage;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.nativeHelpersService.attachImageFile()];
                    case 1:
                        _a = _b.sent(), selectedImageFile = _a.selectedImageFile, selectedViewImage = _a.selectedViewImage;
                        if (selectedImageFile !== undefined || selectedImageFile !== null) {
                            this.attachedImage = true;
                        }
                        this.selectedViewImage = selectedViewImage;
                        this.selectedImageFile = selectedImageFile;
                        return [2 /*return*/];
                }
            });
        });
    };
    MySettingsPage.prototype.presentToast = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: "Your user settings have been updated.",
                            duration: 2000
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    MySettingsPage.prototype.onSave = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var blobInfo, uri, getFilePath, fileExtension;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.attachedImage) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.nativeHelpersService.makeFileIntoBlob(this.selectedImageFile)];
                    case 1:
                        blobInfo = _a.sent();
                        return [4 /*yield*/, this.uploadTask(blobInfo)];
                    case 2:
                        uri = _a.sent();
                        getFilePath = this.selectedImageFile.replace(/^.*[\\\/]/, "");
                        fileExtension = getFilePath.split(".").pop();
                        this.selectedImageFileFormat = fileExtension.split("?")[0];
                        if (this.notificationIsEnabled) {
                            this.fcmService.sub("events", this.deviceToken);
                        }
                        else {
                            this.fcmService.unsub("events", this.deviceToken);
                        }
                        this.userDoc.update({
                            photoUrl: uri,
                            displayName: this.userDisplayName,
                            email: this.userEmail,
                            phoneNumber: this.userPhoneNumber,
                            occupation: this.userOccupation,
                            company_school: this.userCompanySchool,
                            notificationIsEnabled: this.notificationIsEnabled
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        this.userDoc
                            .update({
                            displayName: this.userDisplayName,
                            email: this.userEmail,
                            phoneNumber: this.userPhoneNumber,
                            occupation: this.userOccupation,
                            company_school: this.userCompanySchool,
                            notificationIsEnabled: this.notificationIsEnabled
                        })
                            .then(function () {
                            _this.presentToast();
                        });
                        _a.label = 4;
                    case 4:
                        if (this.userIsSearchable) {
                            this.userDoc
                                .valueChanges()
                                .pipe(map(function (data) {
                                var displayName = data.displayName, photoUrl = data.photoUrl, uid = data.uid;
                                return { displayName: displayName, photoUrl: photoUrl, uid: uid };
                            }))
                                .subscribe(function (userData) {
                                _this.searchUserDoc.set(userData);
                            });
                        }
                        else {
                            this.searchUserDoc.delete();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MySettingsPage = tslib_1.__decorate([
        Component({
            selector: "app-my-settings",
            templateUrl: "./my-settings.page.html",
            styleUrls: ["./my-settings.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [Store,
            AngularFirestore,
            AuthService,
            NativeHelpersService,
            ToastController,
            FcmService])
    ], MySettingsPage);
    return MySettingsPage;
}());
export { MySettingsPage };
//# sourceMappingURL=my-settings.page.js.map
import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as firebase from "firebase";
import { NativeHelpersService } from "../shared/native-helpers.service";
import { LoadingController, ToastController } from "@ionic/angular";
import { isYoutubeLink } from "../utils/utils";
var FormTypeControl;
(function (FormTypeControl) {
    FormTypeControl["DOCUMENT"] = "document";
    FormTypeControl["IMAGE"] = "image";
    FormTypeControl["YOUTUBE"] = "play";
})(FormTypeControl || (FormTypeControl = {}));
var DocumentFormatControl;
(function (DocumentFormatControl) {
    DocumentFormatControl["PDF"] = "pdf";
    DocumentFormatControl["PPT"] = "ppt";
    DocumentFormatControl["PPTX"] = "pptx";
})(DocumentFormatControl || (DocumentFormatControl = {}));
var CreateNewItemPage = /** @class */ (function () {
    function CreateNewItemPage(loadingController, afs, toastController, store, nativeHelpersService) {
        this.loadingController = loadingController;
        this.afs = afs;
        this.toastController = toastController;
        this.store = store;
        this.nativeHelpersService = nativeHelpersService;
        this.defaultViewImage = "assets/img/default.jpg";
        this.dateLog = Date.now();
        this.showImageFormControl = true;
        this.showDocumentFormControl = false;
        this.showYoutubeFormControl = false;
    }
    CreateNewItemPage.prototype.ngOnInit = function () {
        var _this = this;
        this.store
            .pipe(select(fromAppReducer.selectUserId))
            .subscribe(function (userId) { return (_this.userId = userId); });
        this.createImageForm = new FormGroup({
            name: new FormControl(null, Validators.required),
            filePath: new FormControl(null, Validators.required)
        });
        this.createDocumentForm = new FormGroup({
            name: new FormControl(null, Validators.required),
            filePath: new FormControl(null, Validators.required)
        });
        this.createYoutubeLinkForm = new FormGroup({
            name: new FormControl(null, Validators.required),
            url: new FormControl(null, Validators.required)
        });
    };
    CreateNewItemPage.prototype.segmentChanged = function (ev) {
        switch (true) {
            case ev.detail.value === FormTypeControl.DOCUMENT:
                console.log("Document");
                this.showDocumentFormControl = true;
                this.showYoutubeFormControl = false;
                this.showImageFormControl = false;
                break;
            case ev.detail.value === FormTypeControl.YOUTUBE:
                console.log("Play");
                this.showYoutubeFormControl = true;
                this.showImageFormControl = false;
                this.showDocumentFormControl = false;
                break;
            case ev.detail.value === FormTypeControl.IMAGE:
                console.log("Image");
                this.showImageFormControl = true;
                this.showYoutubeFormControl = false;
                this.showDocumentFormControl = false;
                break;
            default:
                console.log("Invalid");
                break;
        }
    };
    CreateNewItemPage.prototype.presentLoading = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.loadingController.create({
                                message: "Uploading File..."
                            })];
                    case 1:
                        _a.isLoading = _b.sent();
                        return [4 /*yield*/, this.isLoading.present()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNewItemPage.prototype.uploadTask = function (blobInfo) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _uploadFileName, _name, _type, _format, uploadTask, uri;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.showImageFormControl) {
                            _uploadFileName =
                                this.createImageForm.get("name").value +
                                    "_" +
                                    this.dateLog +
                                    "." +
                                    this.selectedImageFileFormat;
                            _name = this.createImageForm.get("name").value;
                            _type = "image";
                            _format = this.selectedImageFileFormat;
                        }
                        else if (this.showDocumentFormControl) {
                            _uploadFileName =
                                this.createDocumentForm.get("name").value +
                                    "_" +
                                    this.dateLog +
                                    "." +
                                    this.selectedDocumentFileFormat;
                            _name = this.createDocumentForm.get("name").value;
                            _format = this.selectedDocumentFileFormat;
                            if (this.selectedDocumentFileFormat === DocumentFormatControl.PPT ||
                                this.selectedDocumentFileFormat === DocumentFormatControl.PPTX) {
                                _type = "powerpoint";
                            }
                            else {
                                _type = "document";
                            }
                        }
                        else {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, firebase
                                .storage()
                                .ref()
                                .child("" + _uploadFileName)
                                .put(blobInfo.fileBlob)];
                    case 1:
                        uploadTask = _a.sent();
                        return [4 /*yield*/, uploadTask.ref.getDownloadURL()];
                    case 2:
                        uri = _a.sent();
                        this.uploadForm(_format, _name, _type, uri);
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNewItemPage.prototype.uploadForm = function (_format, _name, _type, _url, _value) {
        if (_value === void 0) { _value = ""; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.afs
                    .collection("item")
                    .add({
                    createdAt: this.dateLog,
                    format: _format,
                    name: _name,
                    type: _type,
                    url: _url,
                    value: _value
                })
                    .then(function (doc) {
                    console.log(doc.id);
                    _this.afs.firestore
                        .doc("users/" + _this.userId + "/private/inventory")
                        .get()
                        .then(function (docSnapshot) {
                        if (docSnapshot.exists) {
                            _this.afs.doc("users/" + _this.userId + "/private/inventory").update({
                                items: firebase.firestore.FieldValue.arrayUnion(doc.id)
                            });
                        }
                        else {
                            _this.afs.doc("users/" + _this.userId + "/private/inventory").set({
                                items: firebase.firestore.FieldValue.arrayUnion(doc.id)
                            });
                        }
                        _this.isLoading.dismiss();
                    });
                    _this.uploadComplete();
                });
                return [2 /*return*/];
            });
        });
    };
    CreateNewItemPage.prototype.uploadComplete = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: "Content Uploaded.",
                            duration: 2000
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        if (this.showDocumentFormControl) {
                            this.createDocumentForm.reset();
                        }
                        else if (this.showYoutubeFormControl) {
                            this.createYoutubeLinkForm.reset();
                        }
                        else {
                            this.createImageForm.reset();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNewItemPage.prototype.onImageFormSubmit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var getFilePath, fileExtension, blobInfo;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.presentLoading();
                        getFilePath = this.createImageForm.get("filePath").value;
                        fileExtension = getFilePath.split(".").pop();
                        this.selectedImageFileFormat = fileExtension.split("?")[0];
                        switch (true) {
                            case this.selectedImageFileFormat === "jpg":
                                break;
                            case this.selectedImageFileFormat === "jpeg":
                                break;
                            case this.selectedImageFileFormat === "png":
                                break;
                            case this.selectedImageFileFormat === "gif":
                                break;
                            default:
                                this.selectedImageFileFormat = "jpeg";
                                break;
                        }
                        return [4 /*yield*/, this.nativeHelpersService.makeFileIntoBlob(this.selectedImageFile)];
                    case 1:
                        blobInfo = _a.sent();
                        this.uploadTask(blobInfo);
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNewItemPage.prototype.onDocumentFormSubmit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var getFilePath, fileExtension, blobInfo;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.presentLoading();
                        getFilePath = this.createDocumentForm.get("filePath").value;
                        fileExtension = getFilePath.split(".").pop();
                        this.selectedDocumentFileFormat = fileExtension.split("?")[0];
                        return [4 /*yield*/, this.nativeHelpersService.makeFileIntoBlob(this.selectedDocumentFile)];
                    case 1:
                        blobInfo = _a.sent();
                        this.uploadTask(blobInfo);
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNewItemPage.prototype.openCamera = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, selectedImageFile, selectedViewImage;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.nativeHelpersService.openCamera()];
                    case 1:
                        _a = _b.sent(), selectedImageFile = _a.selectedImageFile, selectedViewImage = _a.selectedViewImage;
                        this.selectedViewImage = selectedViewImage;
                        this.selectedImageFile = selectedImageFile;
                        this.createImageForm.patchValue({
                            filePath: selectedImageFile.replace(/^.*[\\\/]/, "")
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNewItemPage.prototype.attachImageFile = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, selectedImageFile, selectedViewImage;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.nativeHelpersService.attachImageFile()];
                    case 1:
                        _a = _b.sent(), selectedImageFile = _a.selectedImageFile, selectedViewImage = _a.selectedViewImage;
                        this.selectedViewImage = selectedViewImage;
                        this.selectedImageFile = selectedImageFile;
                        this.createImageForm.patchValue({
                            filePath: selectedImageFile.replace(/^.*[\\\/]/, "")
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNewItemPage.prototype.attachDocumentFile = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var selectedDocumentFile;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nativeHelpersService.attachDocumentFile("application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf,application/vnd.ms-powerpoint")];
                    case 1:
                        selectedDocumentFile = (_a.sent()).selectedDocumentFile;
                        this.selectedDocumentFile = selectedDocumentFile;
                        this.createDocumentForm.patchValue({
                            filePath: this.selectedDocumentFile.replace(/^.*[\\\/]/, "")
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNewItemPage.prototype.onYoutubeFormSubmit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, stat, id, _name, _url, toast;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = isYoutubeLink(this.createYoutubeLinkForm.get("url").value), stat = _a.stat, id = _a.id;
                        _name = this.createYoutubeLinkForm.get("name").value;
                        _url = this.createYoutubeLinkForm.get("url").value;
                        if (!stat) return [3 /*break*/, 1];
                        this.presentLoading();
                        this.uploadForm("link", _name, "youtube", _url, id);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.toastController.create({
                            message: "Invalid URL Format.",
                            duration: 2000
                        })];
                    case 2:
                        toast = _b.sent();
                        toast.present();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateNewItemPage = tslib_1.__decorate([
        Component({
            selector: "app-create-new-item",
            templateUrl: "./create-new-item.page.html",
            styleUrls: ["./create-new-item.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [LoadingController,
            AngularFirestore,
            ToastController,
            Store,
            NativeHelpersService])
    ], CreateNewItemPage);
    return CreateNewItemPage;
}());
export { CreateNewItemPage };
//# sourceMappingURL=create-new-item.page.js.map
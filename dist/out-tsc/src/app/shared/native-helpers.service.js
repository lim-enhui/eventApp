import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { Capacitor } from "@capacitor/core";
import { Camera } from "@ionic-native/camera/ngx";
import { FileChooser } from "@ionic-native/file-chooser/ngx";
import { AngularFireStorage } from "@angular/fire/storage";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { YoutubeVideoPlayer } from "@ionic-native/youtube-video-player/ngx";
import { CallNumber } from "@ionic-native/call-number/ngx";
var NativeHelpersService = /** @class */ (function () {
    function NativeHelpersService(camera, fileChooser, youtube, storage, transfer, file, callNumber) {
        this.camera = camera;
        this.fileChooser = fileChooser;
        this.youtube = youtube;
        this.storage = storage;
        this.transfer = transfer;
        this.file = file;
        this.callNumber = callNumber;
        this.fileTransfer = this.transfer.create();
    }
    NativeHelpersService.prototype.callContact = function (contactNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.callNumber.callNumber(contactNumber, true)];
            });
        });
    };
    NativeHelpersService.prototype.openCamera = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var options;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                options = {
                    quality: 70,
                    destinationType: this.camera.DestinationType.FILE_URI,
                    encodingType: this.camera.EncodingType.JPEG,
                    mediaType: this.camera.MediaType.PICTURE
                };
                return [2 /*return*/, new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var _a, error_1;
                        return tslib_1.__generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = this;
                                    return [4 /*yield*/, this.camera.getPicture(options)];
                                case 1:
                                    _a.selectedImageFile = _b.sent();
                                    this.selectedViewImage = Capacitor.convertFileSrc(this.selectedImageFile);
                                    resolve({
                                        selectedImageFile: this.selectedImageFile,
                                        selectedViewImage: this.selectedViewImage
                                    });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_1 = _b.sent();
                                    reject({ error: error_1 });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    NativeHelpersService.prototype.attachDocumentFile = function (mime) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var _a, error_2;
                        return tslib_1.__generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = this;
                                    return [4 /*yield*/, this.fileChooser.open({
                                            mime: "*/*",
                                            extraMIME: mime
                                        })];
                                case 1:
                                    _a.selectedDocumentFile = _b.sent();
                                    resolve({ selectedDocumentFile: this.selectedDocumentFile });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_2 = _b.sent();
                                    reject({ error: error_2 });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    NativeHelpersService.prototype.attachImageFile = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var options;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                options = {
                    quality: 80,
                    destinationType: this.camera.DestinationType.FILE_URI,
                    encodingType: this.camera.EncodingType.JPEG,
                    mediaType: this.camera.MediaType.ALLMEDIA,
                    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
                };
                return [2 /*return*/, new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var _a, error_3;
                        return tslib_1.__generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = this;
                                    return [4 /*yield*/, this.camera.getPicture(options)];
                                case 1:
                                    _a.selectedImageFile = _b.sent();
                                    this.selectedViewImage = Capacitor.convertFileSrc(this.selectedImageFile);
                                    resolve({
                                        selectedImageFile: this.selectedImageFile,
                                        selectedViewImage: this.selectedViewImage
                                    });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_3 = _b.sent();
                                    reject({ error: error_3 });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    NativeHelpersService.prototype.makeFileIntoBlob = function (_filePath) {
        var _this = this;
        // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var webSafeFile, response, fileBlob;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        webSafeFile = Capacitor.convertFileSrc(_filePath);
                        return [4 /*yield*/, fetch(webSafeFile)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.blob()];
                    case 2:
                        fileBlob = _a.sent();
                        resolve({
                            fileBlob: fileBlob
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    NativeHelpersService.prototype.downloadFileHelper = function (item) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ref, url;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ref = this.storage.ref(item.name + "_" + item.createdAt + "." + item.format);
                        return [4 /*yield*/, ref.getDownloadURL().toPromise()];
                    case 1:
                        url = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var uri, e_1;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.fileTransfer.download(url, this.file.dataDirectory +
                                                    (item.name + "_" + item.createdAt + "." + item.format))];
                                        case 1:
                                            uri = _a.sent();
                                            resolve(uri);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_1 = _a.sent();
                                            reject(e_1);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); })];
                }
            });
        });
    };
    NativeHelpersService.prototype.openYoutubeApp = function (value) {
        this.youtube.openVideo(value);
    };
    NativeHelpersService = tslib_1.__decorate([
        Injectable({
            providedIn: "root"
        }),
        tslib_1.__metadata("design:paramtypes", [Camera,
            FileChooser,
            YoutubeVideoPlayer,
            AngularFireStorage,
            FileTransfer,
            File,
            CallNumber])
    ], NativeHelpersService);
    return NativeHelpersService;
}());
export { NativeHelpersService };
//# sourceMappingURL=native-helpers.service.js.map
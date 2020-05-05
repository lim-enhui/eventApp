import * as tslib_1 from "tslib";
import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Ionic4DatepickerModalComponent } from "@logisticinfotech/ionic4-datepicker";
import { ModalController, LoadingController, ToastController } from "@ionic/angular";
import * as moment from "moment";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import { AngularFirestore } from "@angular/fire/firestore";
import { GeolocationService } from "../shared/geolocation.service";
import { exhaustMap, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { NativeHelpersService } from "../shared/native-helpers.service";
import * as firebase from "firebase";
import { Router } from "@angular/router";
import { sleeper } from "../utils/utils";
var CreateNewEventPage = /** @class */ (function () {
    function CreateNewEventPage(store, modalController, geolocationService, http, toastController, afs, router, loadingController, nativeHelpersService) {
        this.store = store;
        this.modalController = modalController;
        this.geolocationService = geolocationService;
        this.http = http;
        this.toastController = toastController;
        this.afs = afs;
        this.router = router;
        this.loadingController = loadingController;
        this.nativeHelpersService = nativeHelpersService;
        this.defaultViewImage = "assets/img/default.jpg";
        this.dateLog = Date.now();
        this.eventmode = "single";
        this.datePickerConfig = {
            clearButton: false
        };
        this.boolOptOneDayEvent = true;
    }
    CreateNewEventPage.prototype.ngOnInit = function () {
        var _this = this;
        this.store
            .pipe(select(fromAppReducer.selectUserId))
            .subscribe(function (userId) { return (_this.userId = userId); });
        this.createEventForm = new FormGroup({
            eventname: new FormControl(null, Validators.required),
            eventpostal: new FormControl(null, Validators.required),
            eventaddress: new FormControl(null, Validators.required),
            eventinformation: new FormControl(null, Validators.required),
            filePath: new FormControl(null),
            eventstartdate: new FormControl(this.startDateSelected, Validators.required),
            eventenddate: new FormControl(this.endDateSelected)
        });
    };
    CreateNewEventPage.prototype.onSubmit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var getFilePath, fileExtension, blobInfo;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.presentLoading();
                        if (!(this.createEventForm.get("filePath").value !== null)) return [3 /*break*/, 2];
                        getFilePath = this.createEventForm.get("filePath").value;
                        fileExtension = getFilePath.split(".").pop();
                        this.selectedImageFileFormat = fileExtension.split("?")[0];
                        return [4 /*yield*/, this.nativeHelpersService.makeFileIntoBlob(this.selectedImageFile)];
                    case 1:
                        blobInfo = _a.sent();
                        this.uploadTask(blobInfo);
                        return [3 /*break*/, 3];
                    case 2:
                        this.uploadForm();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateNewEventPage.prototype.uploadTask = function (blobInfo) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _uploadFileName, uploadTask, uri;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _uploadFileName =
                            this.createEventForm.get("eventname").value +
                                "_" +
                                this.dateLog +
                                "." +
                                this.selectedImageFileFormat;
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
                        this.uploadForm(uri);
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNewEventPage.prototype.uploadForm = function (_url) {
        if (_url === void 0) { _url = null; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var regexEnter;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                regexEnter = /\n/g;
                this.afs
                    .collection("events")
                    .add({
                    createdAt: this.dateLog,
                    eventname: this.createEventForm.get("eventname").value,
                    eventimage: _url,
                    eventpostal: this.createEventForm.get("eventpostal").value,
                    eventaddress: this.createEventForm.get("eventaddress").value,
                    eventinformation: this.createEventForm
                        .get("eventinformation")
                        .value.replace(regexEnter, "<br/>"),
                    eventstartdate: this.createEventForm.get("eventstartdate").value,
                    eventenddate: this.createEventForm.get("eventenddate").value,
                    eventisonedayevent: this.boolOptOneDayEvent,
                    eventmode: this.eventmode,
                    creator: this.userId,
                    eventlng: this.eventlng,
                    eventlat: this.eventlat,
                    eventtimestart: this.eventtimestart,
                    eventtimeend: this.eventtimeend
                })
                    .then(function (doc) {
                    console.log(doc.id);
                    _this.afs.firestore
                        .doc("users/" + _this.userId + "/private/events")
                        .get()
                        .then(function (docSnapshot) {
                        if (docSnapshot.exists) {
                            _this.afs.doc("users/" + _this.userId + "/private/events").update({
                                createdevents: firebase.firestore.FieldValue.arrayUnion(doc.id)
                            });
                        }
                        else {
                            _this.afs.doc("users/" + _this.userId + "/private/events").set({
                                createdevents: firebase.firestore.FieldValue.arrayUnion(doc.id)
                            });
                        }
                    });
                    _this.uploadComplete();
                });
                return [2 /*return*/];
            });
        });
    };
    CreateNewEventPage.prototype.uploadComplete = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.isLoading.dismiss();
                        return [4 /*yield*/, this.toastController.create({
                                message: "Content Uploaded.",
                                duration: 1000
                            })];
                    case 1:
                        toast = _a.sent();
                        toast
                            .present()
                            .then(function () {
                            return sleeper(2000);
                        })
                            .then(function () {
                            _this.navigateTo("tabs/home");
                        });
                        this.createEventForm.reset();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNewEventPage.prototype.navigateTo = function (page) {
        var url = "/" + page;
        this.router.navigate([url]);
    };
    CreateNewEventPage.prototype.timePicker = function (event, type) {
        var timestamp = moment(event.detail.value);
        if (type === "start") {
            this.eventtimestart = timestamp.format("hh mm A");
        }
        else {
            this.eventtimeend = timestamp.format("hh mm A");
        }
    };
    CreateNewEventPage.prototype.presentLoading = function () {
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
    CreateNewEventPage.prototype.openCamera = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, selectedImageFile, selectedViewImage;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.nativeHelpersService.openCamera()];
                    case 1:
                        _a = _b.sent(), selectedImageFile = _a.selectedImageFile, selectedViewImage = _a.selectedViewImage;
                        this.selectedViewImage = selectedViewImage;
                        this.selectedImageFile = selectedImageFile;
                        console.log(this.selectedViewImage);
                        console.log(this.selectedImageFile);
                        this.createEventForm.patchValue({
                            filePath: selectedImageFile.replace(/^.*[\\\/]/, "")
                        });
                        console.log(this.createEventForm);
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNewEventPage.prototype.addImageFromDevice = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, selectedImageFile, selectedViewImage;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.nativeHelpersService.attachImageFile()];
                    case 1:
                        _a = _b.sent(), selectedImageFile = _a.selectedImageFile, selectedViewImage = _a.selectedViewImage;
                        this.selectedViewImage = selectedViewImage;
                        this.selectedImageFile = selectedImageFile;
                        this.createEventForm.patchValue({
                            filePath: selectedImageFile.replace(/^.*[\\\/]/, "")
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNewEventPage.prototype.selectOneDayOpt = function (event) {
        console.log(event.detail.checked);
        this.boolOptOneDayEvent = event.detail.checked;
    };
    CreateNewEventPage.prototype.openStartDatePicker = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var datePickerModal;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: Ionic4DatepickerModalComponent,
                            cssClass: "li-ionic4-datePicker",
                            componentProps: {
                                objConfig: this.datePickerConfig,
                                selectedDate: this.startDateSelected
                            }
                        })];
                    case 1:
                        datePickerModal = _a.sent();
                        return [4 /*yield*/, datePickerModal.present()];
                    case 2:
                        _a.sent();
                        datePickerModal.onDidDismiss().then(function (data) {
                            console.log(data);
                            _this.startDateSelected = data.data.date;
                            _this.createEventForm.patchValue({
                                eventstartdate: _this.startDateSelected
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNewEventPage.prototype.openEndDatePicker = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var datePickerModal;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: Ionic4DatepickerModalComponent,
                            cssClass: "li-ionic4-datePicker",
                            componentProps: {
                                objConfig: this.datePickerConfig,
                                selectedDate: this.endDateSelected
                            }
                        })];
                    case 1:
                        datePickerModal = _a.sent();
                        return [4 /*yield*/, datePickerModal.present()];
                    case 2:
                        _a.sent();
                        datePickerModal.onDidDismiss().then(function (data) {
                            console.log(data);
                            _this.endDateSelected = data.data.date;
                            _this.createEventForm.patchValue({
                                eventenddate: _this.endDateSelected
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateNewEventPage.prototype.locateMe = function () {
        var _this = this;
        this.geolocationService
            .initGeoLocation()
            .pipe(exhaustMap(function (response) {
            _this.eventlng = response.coords.longitude;
            _this.eventlat = response.coords.latitude;
            return _this.http.get("https://maps.googleapis.com/maps/api/geocode/json?country:SG&radius=200&latlng=" + response.coords.latitude + "," + response.coords.longitude + "&key=" + environment.firebaseAPIKey);
        }))
            .subscribe(function (response) {
            var postalCodeRegex = /[0-9]{6}/;
            console.log(response);
            var strAddress = response.results[0].formatted_address;
            var postalAddress = postalCodeRegex.exec(strAddress)[0];
            _this.createEventForm.patchValue({
                eventpostal: postalAddress,
                eventaddress: strAddress
            });
        });
    };
    CreateNewEventPage.prototype.selectEventMode = function (event) {
        this.eventmode = event.detail.value;
    };
    CreateNewEventPage.prototype.postalHandler = function (event) {
        var _this = this;
        var responseFromOneMap;
        if (+event.srcElement.value && event.srcElement.value.length === 6) {
            this.http
                .get("https://developers.onemap.sg/commonapi/search?searchVal=" + event.srcElement.value + "&returnGeom=N&getAddrDetails=Y")
                .pipe(switchMap(function (response) {
                responseFromOneMap = response;
                return _this.http.get("https://maps.googleapis.com/maps/api/geocode/json?country:SG&radius=200&address=" + +event
                    .srcElement.value + "&key=" + environment.firebaseAPIKey);
            }))
                .subscribe(function (response) {
                _this.eventlat = response.results[0].geometry.location.lat;
                _this.eventlng = response.results[0].geometry.location.lng;
                _this.createEventForm.patchValue({
                    eventpostal: event.srcElement.value,
                    eventaddress: responseFromOneMap.results[0].ADDRESS
                });
            });
        }
    };
    tslib_1.__decorate([
        ViewChild("eventinformation", { static: false }),
        tslib_1.__metadata("design:type", Object)
    ], CreateNewEventPage.prototype, "eventinformation", void 0);
    CreateNewEventPage = tslib_1.__decorate([
        Component({
            selector: "app-create-new-event",
            templateUrl: "./create-new-event.page.html",
            styleUrls: ["./create-new-event.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [Store,
            ModalController,
            GeolocationService,
            HttpClient,
            ToastController,
            AngularFirestore,
            Router,
            LoadingController,
            NativeHelpersService])
    ], CreateNewEventPage);
    return CreateNewEventPage;
}());
export { CreateNewEventPage };
//# sourceMappingURL=create-new-event.page.js.map
import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ModalController } from "@ionic/angular";
import { QrCodePage } from "../qr-code/qr-code.page";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import { AngularFirestore } from "@angular/fire/firestore";
import { switchMap } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { eventsJoin } from "../utils/join.utils";
import * as firebase from "firebase";
var UserPage = /** @class */ (function () {
    function UserPage(http, modalController, router, store, afs) {
        this.http = http;
        this.modalController = modalController;
        this.router = router;
        this.store = store;
        this.afs = afs;
    }
    UserPage.prototype.ngOnInit = function () {
        var _this = this;
        this.store
            .pipe(select(fromAppReducer.selectGeolocation), switchMap(function (location) {
            return _this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + location.latitude + "," + location.longitude + "&key=" + environment.firebaseAPIKey);
        }))
            .subscribe(function (location) {
            console.log(location["results"]);
            var results = location["results"];
            _this.userAtLocation = results[0].formatted_address;
            console.log(_this.userAtLocation);
        });
    };
    UserPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.loadUser();
        this.afs.firestore
            .doc("users/" + this.userId + "/private/events")
            .get()
            .then(function (docSnapshot) {
            if (docSnapshot.exists) {
                console.log("exists");
                _this.afs
                    .doc("users/" + _this.userId + "/private/events")
                    .valueChanges()
                    .pipe(eventsJoin(_this.afs))
                    .subscribe(function (events) {
                    console.log(events);
                    _this.events = events;
                });
            }
            else {
                console.log("not exists");
                _this.afs.doc("users/" + _this.userId + "/private/events").set({
                    createdevents: []
                });
            }
        });
    };
    UserPage.prototype.loadUser = function () {
        var _this = this;
        this.store
            .pipe(select(fromAppReducer.selectUserId))
            .subscribe(function (userId) { return (_this.userId = userId); });
        this.afs
            .doc("users/" + this.userId)
            .valueChanges()
            .subscribe(function (userData) {
            console.log(userData);
            _this.userImage =
                userData.photoUrl === ""
                    ? "assets/img/default_profile.jpg"
                    : userData.photoUrl;
            _this.userDisplayName =
                userData.displayName === null || userData.displayName === ""
                    ? "Anonymous"
                    : userData.displayName;
            _this.userEmail = userData.email;
        });
    };
    UserPage.prototype.presentModal = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: QrCodePage,
                            componentProps: {
                                item: {
                                    id: this.userId,
                                    type: "contact"
                                }
                            }
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserPage.prototype.navigateTo = function (page) {
        var url = "/" + page;
        this.router.navigate([url]);
    };
    UserPage.prototype.delete = function (event) {
        console.log(event);
        this.afs.doc("users/" + this.userId + "/private/events").update({
            createdevents: firebase.firestore.FieldValue.arrayRemove(event.id)
        });
        this.afs.doc("events/" + event.id).delete();
    };
    UserPage = tslib_1.__decorate([
        Component({
            selector: "app-user",
            templateUrl: "./user.page.html",
            styleUrls: ["./user.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            ModalController,
            Router,
            Store,
            AngularFirestore])
    ], UserPage);
    return UserPage;
}());
export { UserPage };
//# sourceMappingURL=user.page.js.map
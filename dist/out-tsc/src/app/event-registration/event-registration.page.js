import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { mergeMap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as firebase from "firebase";
import { Router } from "@angular/router";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { NativeHelpersService } from "../shared/native-helpers.service";
var EventRegistrationPage = /** @class */ (function () {
    function EventRegistrationPage(route, afs, socialSharing, nativeHelpersService, router, store) {
        this.route = route;
        this.afs = afs;
        this.socialSharing = socialSharing;
        this.nativeHelpersService = nativeHelpersService;
        this.router = router;
        this.store = store;
        this.defaultImage = "assets/img/default.jpg";
    }
    EventRegistrationPage.prototype.ngOnInit = function () {
        var _this = this;
        this.store
            .pipe(select(fromAppReducer.selectUserId))
            .subscribe(function (userId) { return (_this.userId = userId); });
        this.route.paramMap
            .pipe(mergeMap(function (route) {
            _this.event = Object.assign({}, route.params);
            // this.latitude = +route.params.eventlat;
            // this.longitude = +route.params.eventlng;
            return _this.afs.doc("users/" + route.params.creator).valueChanges();
        }))
            .subscribe(function (user) {
            _this.eventUser = user;
        });
    };
    EventRegistrationPage.prototype.ionViewWillEnter = function () { };
    EventRegistrationPage.prototype.onClick = function (type) {
        var _this = this;
        if (type === "email") {
            console.log("email");
            this.socialSharing
                .canShareViaEmail()
                .then(function () {
                // Sharing via email is possible
                // Share via email
                console.log("can share by email");
                _this.socialSharing.shareViaEmail("", "from eventApp", [
                    _this.eventUser.email
                ]);
            })
                .catch(function () {
                // Sharing via email is not possible
                console.error("error");
            });
        }
        else if (type === "call") {
            this.nativeHelpersService
                .callContact(this.eventUser.phoneNumber.toString())
                .then(function (res) { return console.log("Launched dialer!", res); })
                .catch(function (err) { return console.log("Error launching dialer", err); });
        }
        else {
            console.log("message");
            this.textContact(this.eventUser.uid);
        }
    };
    EventRegistrationPage.prototype.textContact = function (userId) {
        var _this = this;
        console.log(userId);
        // this.navigateTo("message/9K257FZcnOX6pBAJ0XDz");
        this.afs
            .collection("message")
            .add({
            chats: [],
            recipients: [userId, this.userId]
        })
            .then(function (doc) {
            console.log(doc);
            _this.afs.firestore
                .doc("users/" + _this.userId + "/private/inbox")
                .get()
                .then(function (docSnapshot) {
                if (docSnapshot.exists) {
                    _this.afs.doc("users/" + _this.userId + "/private/inbox").update({
                        messages: firebase.firestore.FieldValue.arrayUnion(doc.id)
                    });
                }
                else {
                    _this.afs.doc("users/" + _this.userId + "/private/inbox").set({
                        messages: firebase.firestore.FieldValue.arrayUnion(doc.id)
                    });
                }
                _this.navigateTo("message/" + doc.id);
            });
        });
    };
    EventRegistrationPage.prototype.navigateTo = function (page) {
        var url = "/" + page;
        console.log(url);
        this.router.navigate([url]);
    };
    EventRegistrationPage = tslib_1.__decorate([
        Component({
            selector: "app-event-registration",
            templateUrl: "./event-registration.page.html",
            styleUrls: ["./event-registration.page.scss"],
            providers: []
        }),
        tslib_1.__metadata("design:paramtypes", [ActivatedRoute,
            AngularFirestore,
            SocialSharing,
            NativeHelpersService,
            Router,
            Store])
    ], EventRegistrationPage);
    return EventRegistrationPage;
}());
export { EventRegistrationPage };
//# sourceMappingURL=event-registration.page.js.map
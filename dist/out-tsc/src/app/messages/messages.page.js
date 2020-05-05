import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as fromAppActions from "../store/app.actions";
import { Router } from "@angular/router";
import * as firebase from "firebase";
var MessagesPage = /** @class */ (function () {
    function MessagesPage(store, navCtrl, afs, router) {
        this.store = store;
        this.navCtrl = navCtrl;
        this.afs = afs;
        this.router = router;
        this.defaultImage = "assets/img/default_profile.jpg";
    }
    MessagesPage.prototype.ngOnInit = function () {
        var _this = this;
        this.store.pipe(select(fromAppReducer.selectUserId)).subscribe(function (userId) {
            _this.userId = userId;
        });
        this.store
            .pipe(select(fromAppReducer.selectMessages))
            .subscribe(function (messages) {
            _this.messages = messages;
        });
    };
    MessagesPage.prototype.ionViewWillEnter = function () {
        console.log("ion enter");
        this.store.dispatch(fromAppActions.loadMessages());
    };
    MessagesPage.prototype.openMessage = function (id) {
        console.log("Open Message");
        this.router.navigate(["/message/" + id]);
    };
    MessagesPage.prototype.deleteMessage = function (id, bool) {
        var _this = this;
        if (bool === void 0) { bool = false; }
        console.log(id);
        this.afs
            .doc("users/" + this.userId + "/private/inbox")
            .update({
            messages: firebase.firestore.FieldValue.arrayRemove(id)
        })
            .then(function () {
            if (bool) {
                // if it is true, it implies message is empty.
                // safe to delete
                _this.afs.doc("message/" + id).delete();
            }
            _this.store.dispatch(fromAppActions.loadMessages());
        });
    };
    MessagesPage.prototype.navigateTo = function (url) {
        console.log("navigate forward");
        this.navCtrl.navigateForward("/" + url);
    };
    MessagesPage = tslib_1.__decorate([
        Component({
            selector: "app-messages",
            templateUrl: "./messages.page.html",
            styleUrls: ["./messages.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [Store,
            NavController,
            AngularFirestore,
            Router])
    ], MessagesPage);
    return MessagesPage;
}());
export { MessagesPage };
//# sourceMappingURL=messages.page.js.map
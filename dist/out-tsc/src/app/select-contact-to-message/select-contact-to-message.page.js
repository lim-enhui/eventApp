import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import { usersJoin } from "../utils/join.utils";
import { Router } from "@angular/router";
import * as firebase from "firebase";
var SelectContactToMessagePage = /** @class */ (function () {
    function SelectContactToMessagePage(http, afs, router, store) {
        this.http = http;
        this.afs = afs;
        this.router = router;
        this.store = store;
    }
    SelectContactToMessagePage.prototype.ngOnInit = function () {
        var _this = this;
        this.store
            .pipe(select(fromAppReducer.selectUserId))
            .subscribe(function (userId) { return (_this.userId = userId); });
        this.loadContacts();
    };
    SelectContactToMessagePage.prototype.loadContacts = function () {
        var _this = this;
        this.afs.firestore
            .doc("users/" + this.userId + "/private/contacts")
            .get()
            .then(function (docSnapshot) {
            if (docSnapshot.exists) {
                _this.afs
                    .doc("users/" + _this.userId + "/private/contacts")
                    .valueChanges()
                    .pipe(usersJoin(_this.afs))
                    .subscribe(function (contacts) {
                    _this.contacts = contacts.sort(function (a, b) {
                        if (a.displayName < b.displayName) {
                            return -1;
                        }
                        if (a.displayName > b.displayName) {
                            return 1;
                        }
                        return 0;
                    });
                });
            }
            else {
                _this.afs.doc("users/" + _this.userId + "/private/contacts").set({
                    users: []
                });
            }
        });
    };
    SelectContactToMessagePage.prototype.seperateLetter = function (record, recordIndex, records) {
        if (recordIndex == 0) {
            return record.displayName[0].toUpperCase();
        }
        var first_prev = records[recordIndex - 1].displayName[0];
        var first_current = record.displayName[0];
        if (first_prev != first_current) {
            return first_current.toUpperCase();
        }
        return null;
    };
    SelectContactToMessagePage.prototype.messageContact = function (uid) {
        var _this = this;
        console.log(uid);
        this.afs
            .collection("message")
            .add({
            chats: [],
            recipients: [uid, this.userId]
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
    SelectContactToMessagePage.prototype.navigateTo = function (page) {
        var url = "/" + page;
        console.log(url);
        this.router.navigate([url]);
    };
    SelectContactToMessagePage = tslib_1.__decorate([
        Component({
            selector: "app-select-contact-to-message",
            templateUrl: "./select-contact-to-message.page.html",
            styleUrls: ["./select-contact-to-message.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            AngularFirestore,
            Router,
            Store])
    ], SelectContactToMessagePage);
    return SelectContactToMessagePage;
}());
export { SelectContactToMessagePage };
//# sourceMappingURL=select-contact-to-message.page.js.map
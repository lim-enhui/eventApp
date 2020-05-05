import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import { usersJoin } from "../utils/join.utils";
import * as firebase from "firebase";
var ContactsPage = /** @class */ (function () {
    function ContactsPage(http, callNumber, router, afs, store) {
        this.http = http;
        this.callNumber = callNumber;
        this.router = router;
        this.afs = afs;
        this.store = store;
    }
    ContactsPage.prototype.ngOnInit = function () {
        var _this = this;
        this.store
            .pipe(select(fromAppReducer.selectUserId))
            .subscribe(function (userId) { return (_this.userId = userId); });
        this.loadContacts();
    };
    ContactsPage.prototype.loadContacts = function () {
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
                    _this.contacts = contacts;
                });
            }
            else {
                _this.afs.doc("users/" + _this.userId + "/private/contacts").set({
                    users: []
                });
            }
        });
    };
    ContactsPage.prototype.seperateLetter = function (record, recordIndex, records) {
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
    ContactsPage.prototype.callContact = function (contactNumber) {
        this.callNumber
            .callNumber(contactNumber, true)
            .then(function (res) { return console.log("Launched dialer!", res); })
            .catch(function (err) { return console.log("Error launching dialer", err); });
    };
    ContactsPage.prototype.textContact = function (userId) {
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
    ContactsPage.prototype.navigateTo = function (page) {
        var url = "/" + page;
        console.log(url);
        this.router.navigate([url]);
    };
    ContactsPage = tslib_1.__decorate([
        Component({
            selector: "app-contacts",
            templateUrl: "./contacts.page.html",
            styleUrls: ["./contacts.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            CallNumber,
            Router,
            AngularFirestore,
            Store])
    ], ContactsPage);
    return ContactsPage;
}());
export { ContactsPage };
//# sourceMappingURL=contacts.page.js.map
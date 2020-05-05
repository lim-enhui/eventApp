import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import { Subject, combineLatest } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase";
var AddContactPage = /** @class */ (function () {
    function AddContactPage(store, afs) {
        this.store = store;
        this.afs = afs;
        this.searchInput = "";
        this.searchInput$ = new Subject();
    }
    AddContactPage.prototype.ngOnInit = function () {
        var _this = this;
        this.store
            .pipe(select(fromAppReducer.selectUserId))
            .subscribe(function (userId) { return (_this.userId = userId); });
        this.afs.firestore
            .doc("users/" + this.userId + "/private/contacts")
            .get()
            .then(function (docSnapshot) {
            if (!docSnapshot.exists) {
                _this.afs.doc("users/" + _this.userId + "/private/contacts").set({
                    users: []
                });
            }
            else {
                _this.existingContacts = docSnapshot.get("users");
                _this.afs
                    .doc("users/" + _this.userId + "/private/contacts")
                    .valueChanges()
                    .subscribe(function (data) {
                    _this.existingContacts = data.users;
                });
            }
        });
        this.loadContacts();
    };
    AddContactPage.prototype.filterInput = function (event) {
        if (event.detail.value.length > 3) {
            this.searchInput$.next(event.detail.value);
        }
    };
    AddContactPage.prototype.loadContacts = function () {
        var _this = this;
        var fetchContacts = this.afs
            .collection("search")
            .valueChanges();
        combineLatest(fetchContacts, this.searchInput$).subscribe(function (_a) {
            var _fetchContacts = _a[0], input = _a[1];
            _this.contacts = [
                _fetchContacts.find(function (el) {
                    var input_lowercase = input.toLowerCase();
                    return el.displayName.toLowerCase().includes(input_lowercase);
                })
            ];
        });
    };
    AddContactPage.prototype.addContact = function (contact) {
        this.afs.doc("users/" + this.userId + "/private/contacts").update({
            users: firebase.firestore.FieldValue.arrayUnion(contact.uid)
        });
    };
    AddContactPage = tslib_1.__decorate([
        Component({
            selector: "app-add-contact",
            templateUrl: "./add-contact.page.html",
            styleUrls: ["./add-contact.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [Store,
            AngularFirestore])
    ], AddContactPage);
    return AddContactPage;
}());
export { AddContactPage };
//# sourceMappingURL=add-contact.page.js.map
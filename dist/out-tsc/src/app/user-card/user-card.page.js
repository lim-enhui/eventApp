import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { ModalController, NavParams } from "@ionic/angular";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as firebase from "firebase";
import { Contacts, ContactName, ContactField } from "@ionic-native/contacts/ngx";
var UserCardPage = /** @class */ (function () {
    function UserCardPage(afs, route, router, contacts, toastController, modalController, navParams, store) {
        this.afs = afs;
        this.route = route;
        this.router = router;
        this.contacts = contacts;
        this.toastController = toastController;
        this.modalController = modalController;
        this.navParams = navParams;
        this.store = store;
        this.contactId = "";
        this.userId = "";
    }
    UserCardPage.prototype.ngOnInit = function () {
        var _this = this;
        console.log(this.navParams);
        var item = this.navParams.get("item");
        this.contactId = item.id;
        this.store
            .pipe(select(fromAppReducer.selectUserId))
            .subscribe(function (userId) { return (_this.userId = userId); });
        this.afs
            .doc("users/" + this.contactId)
            .valueChanges()
            .subscribe(function (contact) {
            console.log(contact);
            _this.contact = contact;
        });
    };
    UserCardPage.prototype.presentToast = function (message) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: message,
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
    UserCardPage.prototype.addContact = function (type) {
        var _this = this;
        if (type === "native") {
            var contact = this.contacts.create();
            contact.name = new ContactName(null, null, this.contact.displayName);
            contact.phoneNumbers = [
                new ContactField("mobile", this.contact.phoneNumber.toString())
            ];
            if (this.contact.email !== null) {
                contact.emails = [new ContactField("email", this.contact.email)];
            }
            // contact.birthday = new Date();
            contact.save().then(function () { return _this.presentToast("Contact has been saved to device Phonebook!"); }, function (error) { return console.error("Error saving contact.", error); });
        }
        else if (type === "app") {
            this.afs
                .doc("users/" + this.userId + "/private/contacts")
                .update({
                users: firebase.firestore.FieldValue.arrayUnion(this.contactId)
            })
                .then(function () {
                _this.presentToast("Contact has been added to Contact List!");
            });
        }
    };
    UserCardPage.prototype.textContact = function () {
        var _this = this;
        this.afs
            .collection("message")
            .add({
            chats: [],
            recipients: [this.contactId, this.userId]
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
    UserCardPage.prototype.navigateTo = function (page) {
        var url = page;
        console.log(url);
        // this.router.navigate([url]);
        this.dismiss(true, url);
    };
    UserCardPage.prototype.dismiss = function (boolNavigateToMessage, url) {
        if (boolNavigateToMessage === void 0) { boolNavigateToMessage = false; }
        if (url === void 0) { url = ""; }
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
            dismissed: true,
            boolNavigateToMessage: boolNavigateToMessage,
            url: url
        });
    };
    UserCardPage = tslib_1.__decorate([
        Component({
            selector: "app-user-card",
            templateUrl: "./user-card.page.html",
            styleUrls: ["./user-card.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore,
            ActivatedRoute,
            Router,
            Contacts,
            ToastController,
            ModalController,
            NavParams,
            Store])
    ], UserCardPage);
    return UserCardPage;
}());
export { UserCardPage };
//# sourceMappingURL=user-card.page.js.map
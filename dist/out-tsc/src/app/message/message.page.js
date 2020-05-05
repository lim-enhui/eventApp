import * as tslib_1 from "tslib";
import { Component, ViewChild } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { firestore } from "firebase";
import { ActivatedRoute } from "@angular/router";
import { messageJoin } from "../utils/join.utils";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as firebase from "firebase";
import { NavController } from "@ionic/angular";
import * as fromAppActions from "../store/app.actions";
var MessagePage = /** @class */ (function () {
    function MessagePage(afs, route, navCtrl, store) {
        this.afs = afs;
        this.route = route;
        this.navCtrl = navCtrl;
        this.store = store;
        this.boolAddUserToMessage = false;
    }
    MessagePage.prototype.ngAfterViewInit = function () {
        console.log(this.messageContainer);
        this.messageContainer.scrollToBottom();
    };
    MessagePage.prototype.ngOnInit = function () {
        var _this = this;
        this.store
            .pipe(select(fromAppReducer.selectUserId))
            .subscribe(function (userId) { return (_this.userId = userId); });
        this.route.paramMap.subscribe(function (params) {
            _this.messageId = params.get("id");
        });
        this.afs
            .doc("message/" + this.messageId)
            .valueChanges()
            .pipe(messageJoin(this.afs))
            .subscribe(function (response) {
            _this.messages = response.chats;
            _this.messageContainer.scrollToBottom();
            if (response.chats.length === 0) {
                _this.boolAddUserToMessage = true;
                var recipientIndex = response.recipients.findIndex(function (el) {
                    return el.uid !== _this.userId;
                });
                var recipientIdArray = response.recipients.splice(recipientIndex, 1);
                _this.recipient = recipientIdArray.pop();
            }
        });
    };
    MessagePage.prototype.ionViewDidEnter = function () {
        this.messageContainer.scrollToBottom();
    };
    MessagePage.prototype.navigateTo = function (url) {
        this.store.dispatch(fromAppActions.loadMessages());
        this.navCtrl.navigateRoot(["/" + url]);
    };
    MessagePage.prototype.sendMsg = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, ref;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                console.log(this.editorMsg);
                data = {
                    uid: this.userId,
                    content: this.editorMsg,
                    createdAt: Date.now()
                };
                if (this.boolAddUserToMessage) {
                    this.afs.firestore
                        .doc("users/" + this.recipient.uid + "/private/inbox")
                        .get()
                        .then(function (docSnapshot) {
                        if (docSnapshot.exists) {
                            _this.afs.doc("users/" + _this.recipient.uid + "/private/inbox").update({
                                messages: firebase.firestore.FieldValue.arrayUnion(_this.messageId)
                            });
                        }
                        else {
                            _this.afs.doc("users/" + _this.recipient.uid + "/private/inbox").set({
                                messages: [_this.messageId]
                            });
                        }
                    });
                }
                ref = this.afs.collection("message").doc(this.messageId);
                ref.update({
                    chats: firestore.FieldValue.arrayUnion(data)
                });
                this.messageContainer.scrollToBottom();
                this.editorMsg = "";
                return [2 /*return*/];
            });
        });
    };
    tslib_1.__decorate([
        ViewChild("messageContainer", { static: false }),
        tslib_1.__metadata("design:type", Object)
    ], MessagePage.prototype, "messageContainer", void 0);
    MessagePage = tslib_1.__decorate([
        Component({
            selector: "app-message",
            templateUrl: "./message.page.html",
            styleUrls: ["./message.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore,
            ActivatedRoute,
            NavController,
            Store])
    ], MessagePage);
    return MessagePage;
}());
export { MessagePage };
//# sourceMappingURL=message.page.js.map
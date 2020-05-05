import * as tslib_1 from "tslib";
import { Pipe } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
var getRecipientPipe = /** @class */ (function () {
    function getRecipientPipe(afs) {
        this.afs = afs;
    }
    getRecipientPipe.prototype.transform = function (users, userId) {
        var recipientId;
        var _users = users.slice();
        var userIndex = _users.findIndex(function (el) { return el !== userId; });
        _users = _users.splice(userIndex, 1);
        recipientId = _users.pop();
        return this.afs.doc("users/" + recipientId).valueChanges();
    };
    getRecipientPipe = tslib_1.__decorate([
        Pipe({ name: "getRecipient" }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore])
    ], getRecipientPipe);
    return getRecipientPipe;
}());
export { getRecipientPipe };
//# sourceMappingURL=recipient.pipe.js.map
import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { AngularFireFunctions } from "@angular/fire/functions";
import { tap } from "rxjs/operators";
var FcmService = /** @class */ (function () {
    function FcmService(fun) {
        this.fun = fun;
    }
    FcmService.prototype.setToken = function (token) {
        this.token = token;
    };
    FcmService.prototype.sub = function (topic, token) {
        this.fun
            .httpsCallable("subscribeToTopic")({ topic: topic, token: token })
            .pipe(tap(function (_) { return console.log("subscribed to " + topic); }))
            .subscribe();
    };
    FcmService.prototype.unsub = function (topic, token) {
        this.fun
            .httpsCallable("unsubscribeToTopic")({ topic: topic, token: token })
            .pipe(tap(function (_) { return console.log("unsubscribed to " + topic); }))
            .subscribe();
    };
    FcmService = tslib_1.__decorate([
        Injectable({
            providedIn: "root"
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFireFunctions])
    ], FcmService);
    return FcmService;
}());
export { FcmService };
//# sourceMappingURL=fcm.service.js.map
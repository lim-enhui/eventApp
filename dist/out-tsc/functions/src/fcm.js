var _this = this;
import * as tslib_1 from "tslib";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
export var subscribeToTopic = functions.https.onCall(function (data, context) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, admin.messaging().subscribeToTopic(data.token, data.topic)];
            case 1:
                _a.sent();
                return [2 /*return*/, "subscribed to " + data.topic];
        }
    });
}); });
export var unsubsribeFromTopic = functions.https.onCall(function (data, context) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, admin.messaging().unsubscribeFromTopic(data.token, data.topic)];
            case 1:
                _a.sent();
                return [2 /*return*/, "unsubscribed from " + data.topic];
        }
    });
}); });
export var sendOnFirestoreCreate = functions.firestore
    .document("events/{eventId}")
    .onCreate(function (snapshot) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var event, notification, payload;
    return tslib_1.__generator(this, function (_a) {
        event = snapshot.data();
        notification = {
            title: "New Event " + event.eventname + " Published",
            body: event.eventaddress
        };
        payload = {
            notification: notification,
            webpush: {
                notification: {
                    vibrate: [200, 100, 200]
                }
            },
            topic: "events"
        };
        return [2 /*return*/, admin.messaging().send(payload)];
    });
}); });
//# sourceMappingURL=fcm.js.map
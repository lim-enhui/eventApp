import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { GeolocationService } from "../shared/geolocation.service";
import * as fromAppActions from "./app.actions";
import * as fromAppReducer from "./app.reducer";
import { map, mergeMap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store, select } from "@ngrx/store";
import { messagesJoin } from "../utils/utils";
var AppEffect = /** @class */ (function () {
    function AppEffect(actions$, geolocationService, store, afs) {
        var _this = this;
        this.actions$ = actions$;
        this.geolocationService = geolocationService;
        this.store = store;
        this.afs = afs;
        this.loadGeolocation$ = createEffect(function () {
            return _this.actions$.pipe(ofType(fromAppActions.loadGeoLocation), mergeMap(function () {
                return _this.geolocationService.initGeoLocation().pipe(map(function (response) {
                    return fromAppActions.loadGeoLocationSuccess({
                        latitude: response.coords.latitude,
                        longitude: response.coords.longitude
                    });
                }));
            }));
        });
        this.loadEvents$ = createEffect(function () {
            return _this.actions$.pipe(ofType(fromAppActions.loadEvents), mergeMap(function () {
                return _this.afs
                    .collection("events")
                    .valueChanges()
                    .pipe(map(function (events) {
                    return fromAppActions.loadEventsSuccess({
                        events: events
                    });
                }));
            }));
        });
        this.loadMessages$ = createEffect(function () {
            return _this.actions$.pipe(ofType(fromAppActions.loadMessages), mergeMap(function () {
                return _this.store.pipe(select(fromAppReducer.selectUserId));
            }), mergeMap(function (userId) {
                return _this.afs
                    .doc("users/" + userId + "/private/inbox")
                    .valueChanges()
                    .pipe(messagesJoin(_this.afs), map(function (response) {
                    return fromAppActions.loadMessagesSuccess(response);
                }));
            }));
        });
    }
    AppEffect = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Actions,
            GeolocationService,
            Store,
            AngularFirestore])
    ], AppEffect);
    return AppEffect;
}());
export { AppEffect };
//# sourceMappingURL=app.effects.js.map
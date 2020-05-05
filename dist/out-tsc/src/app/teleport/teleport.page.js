import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as fromAppActions from "../store/app.actions";
var TeleportPage = /** @class */ (function () {
    function TeleportPage(store) {
        this.store = store;
        this.zoom = 18;
    }
    TeleportPage.prototype.ngOnInit = function () {
        var _this = this;
        this.geolocation$ = this.store.pipe(select(fromAppReducer.selectGeolocation));
        this.geolocation$.subscribe(function (coords) {
            _this.latitude = coords.latitude;
            _this.longitude = coords.longitude;
            console.log(coords);
        });
    };
    TeleportPage.prototype.onChoseLocation = function (event) {
        this.store.dispatch(fromAppActions.updateGeoLocation({
            latitude: event.coords.lat,
            longitude: event.coords.lng
        }));
    };
    TeleportPage = tslib_1.__decorate([
        Component({
            selector: "app-teleport",
            templateUrl: "./teleport.page.html",
            styleUrls: ["./teleport.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [Store])
    ], TeleportPage);
    return TeleportPage;
}());
export { TeleportPage };
//# sourceMappingURL=teleport.page.js.map
import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { BehaviorSubject, from } from "rxjs";
import { Geolocation } from "@ionic-native/geolocation/ngx";
var GeolocationService = /** @class */ (function () {
    function GeolocationService(geolocation) {
        this.geolocation = geolocation;
        this.geoLocation = {
            longitude: null,
            latitude: null
        };
        this.geoLocation$ = new BehaviorSubject(this.geoLocation);
    }
    GeolocationService.prototype.initGeoLocation = function () {
        return from(this.geolocation.getCurrentPosition());
    };
    GeolocationService.prototype.getLocation$ = function () {
        return this.geoLocation$.asObservable();
    };
    GeolocationService.prototype.postLocation = function (location) {
        this.geoLocation$.next(location);
    };
    GeolocationService = tslib_1.__decorate([
        Injectable({
            providedIn: "root"
        }),
        tslib_1.__metadata("design:paramtypes", [Geolocation])
    ], GeolocationService);
    return GeolocationService;
}());
export { GeolocationService };
//# sourceMappingURL=geolocation.service.js.map
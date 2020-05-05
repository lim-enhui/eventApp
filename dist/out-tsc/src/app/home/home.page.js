import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import { map, switchMap } from "rxjs/operators";
import { distanceInKmBetweenEarthCoordinates } from "../utils/utils";
import * as moment from "moment";
var HomePage = /** @class */ (function () {
    function HomePage(menuController, router, store) {
        this.menuController = menuController;
        this.router = router;
        this.store = store;
        this.distance = 3;
        this.eventDateTimePreference = "All";
        this.defaultImage = "assets/img/default.jpg";
    }
    HomePage.prototype.ngOnInit = function () {
        var _this = this;
        console.log("ngOnInit [Home Page]");
        this.store
            .pipe(select(fromAppReducer.selectGeolocation))
            .pipe(switchMap(function (geolocation) {
            return _this.store.pipe(select(fromAppReducer.selectEvents)).pipe(map(function (events) {
                var _events = events.map(function (element) {
                    var eventlat = element.eventlat, eventlng = element.eventlng;
                    var distance = distanceInKmBetweenEarthCoordinates(eventlat, eventlng, geolocation.latitude, geolocation.longitude);
                    return tslib_1.__assign({}, element, { distance: distance });
                });
                return _events;
            }));
        }))
            .subscribe(function (events) {
            console.log(events);
            _this.allEvents = events.filter(function (element) {
                return (moment(element.eventstartdate).format("DD MMM YYYY") >=
                    moment().format("DD MMM YYYY") || element.eventmode === "weekly");
            });
            _this.events = events.filter(function (element) {
                return (+element.distance < +_this.distance &&
                    moment(element.eventstartdate).format("DD MMM YYYY") >=
                        moment().format("DD MMM YYYY"));
            });
        });
    };
    HomePage.prototype.updateEvents = function () {
        var _this = this;
        console.log("update Events");
        this.allEvents.map(function (element) {
            var eventlat = element.eventlat, eventlng = element.eventlng;
            var distance = distanceInKmBetweenEarthCoordinates(eventlat, eventlng, _this.latitude, _this.longitude);
            return tslib_1.__assign({}, element, { distance: distance });
        });
        this.events = this.allEvents.filter(function (element) {
            return (+element.distance < +_this.distance &&
                Date.parse(element.eventstartdate) >= Date.now());
        });
    };
    HomePage.prototype.ionViewWillEnter = function () { };
    HomePage.prototype.truncateString = function (str, num) {
        // If the length of str is less than or equal to num
        // just return str--don't truncate it.
        if (str.length <= num) {
            return str;
        }
        // Return str truncated with '...' concatenated to the end of str.
        return str.slice(0, num) + "...";
    };
    HomePage.prototype.onDistanceChange = function (event) {
        console.log(event.detail.value);
        this.events = this.allEvents.filter(function (element) { return element.distance < +event.detail.value; });
    };
    HomePage.prototype.toggleRightMenu = function () {
        this.menuController.toggle("end");
    };
    HomePage.prototype.radioGroupChange = function (event) {
        console.log("radioGroupChange", event.detail);
    };
    HomePage.prototype.radioSelect = function (event) {
        var _this = this;
        console.log("radioSelect", event.detail.value);
        if (event.detail.value === "all") {
            this.events = this.allEvents.filter(function (element) { return element.distance < +_this.distance; });
        }
        else if (event.detail.value === "weekly") {
            this.events = this.allEvents.filter(function (element) {
                return element.distance < +_this.distance &&
                    element.eventmode === event.detail.value;
            });
        }
        else {
            this.events = this.allEvents.filter(function (element) {
                console.log(element);
                return (element.distance < +_this.distance &&
                    moment(element.eventstartdate).format("DD MMM YYYY") ==
                        moment().format("DD MMM YYYY"));
            });
        }
    };
    HomePage.prototype.navigateTo = function (page, params) {
        if (params === void 0) { params = {}; }
        var url = "/" + page;
        console.log(url);
        this.router.navigate([url, params]);
    };
    HomePage = tslib_1.__decorate([
        Component({
            selector: "app-home",
            templateUrl: "home.page.html",
            styleUrls: ["home.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController,
            Router,
            Store])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map
import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { Platform, MenuController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AuthService } from "./auth/auth.service";
import { Store } from "@ngrx/store";
import * as fromAppActions from "./store/app.actions";
import { Plugins } from "@capacitor/core";
var PushNotifications = Plugins.PushNotifications;
var AppComponent = /** @class */ (function () {
    function AppComponent(store, platform, splashScreen, statusBar, auth, menuController) {
        this.store = store;
        this.platform = platform;
        this.splashScreen = splashScreen;
        this.statusBar = statusBar;
        this.auth = auth;
        this.menuController = menuController;
        this.initializeApp();
    }
    AppComponent.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("App Initialization");
        this.store.dispatch(fromAppActions.loadGeoLocation());
        this.store.dispatch(fromAppActions.loadEvents());
        if (this.platform.is("capacitor")) {
            // Register with Apple / Google to receive push via APNS/FCM
            PushNotifications.register();
            // On success, we should be able to receive notifications
            PushNotifications.addListener("registration", function (token) {
                // alert("Push registration success, token: " + token.value);
                console.log(token.value);
                _this.store.dispatch(fromAppActions.loadDeviceToken({ token: token.value }));
            });
            // Some issue with our setup and push will not work
            PushNotifications.addListener("registrationError", function (error) {
                // alert("Error on registration: " + JSON.stringify(error));
            });
            // Show us the notification payload if the app is open on our device
            PushNotifications.addListener("pushNotificationReceived", function (notification) {
                alert("Push received: " + JSON.stringify(notification));
            });
            // Method called when tapping on a notification
            PushNotifications.addListener("pushNotificationActionPerformed", function (notification) {
                alert("Push action performed: " + JSON.stringify(notification));
            });
        }
    };
    AppComponent.prototype.closeMenu = function () {
        this.menuController.close();
    };
    AppComponent.prototype.signOut = function () {
        this.auth.logout();
        this.menuController.close();
    };
    AppComponent = tslib_1.__decorate([
        Component({
            selector: "app-root",
            templateUrl: "app.component.html"
        }),
        tslib_1.__metadata("design:paramtypes", [Store,
            Platform,
            SplashScreen,
            StatusBar,
            AuthService,
            MenuController])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map
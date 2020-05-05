import * as tslib_1 from "tslib";
import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
var AuthPage = /** @class */ (function () {
    function AuthPage(platform, router, authService) {
        this.platform = platform;
        this.router = router;
        this.authService = authService;
        this.isLogin = true;
        this.isLoading = false;
    }
    AuthPage.prototype.authenticate = function (email, password) {
        var _this = this;
        var authObs;
        if (this.isLogin) {
            authObs = this.authService.login(email, password);
        }
        else {
            authObs = this.authService.signup(email, password);
        }
        authObs.subscribe(function () {
            _this.router.navigateByUrl("/tabs/home");
        }, function (err) {
            console.log(err);
        });
    };
    AuthPage.prototype.onSubmit = function (form) {
        if (!form.valid) {
            return;
        }
        var email = form.value.email;
        var password = form.value.password;
        this.authenticate(email, password);
        form.reset();
    };
    AuthPage.prototype.onSwitchAuthMode = function (form) {
        form.reset();
        this.isLogin = !this.isLogin;
    };
    AuthPage.prototype.googleLogin = function () {
        var _this = this;
        if (this.platform.is("cordova")) {
            this.authService.nativeGoogleLogin().then(function (res) {
                console.log(res);
                _this.authService.setUserData(res, "google");
                _this.router.navigateByUrl("/tabs/home");
            });
        }
    };
    AuthPage.prototype.facebookLogin = function () {
        var _this = this;
        if (this.platform.is("cordova")) {
            this.authService.nativeFacebookLogin().then(function (res) {
                console.log(res);
                _this.authService.setUserData(res, "facebook");
                _this.router.navigateByUrl("/tabs/home");
            });
        }
    };
    AuthPage = tslib_1.__decorate([
        Component({
            selector: "app-auth",
            templateUrl: "./auth.page.html",
            styleUrls: ["./auth.page.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [Platform,
            Router,
            AuthService])
    ], AuthPage);
    return AuthPage;
}());
export { AuthPage };
//# sourceMappingURL=auth.page.js.map
import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { take, tap, switchMap } from "rxjs/operators";
import { AuthService } from "./auth.service";
var AuthGuard = /** @class */ (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuard.prototype.canLoad = function (route, segments) {
        var _this = this;
        return this.authService.userIsAuthenticated.pipe(take(1), switchMap(function (isAuthenticated) {
            if (!isAuthenticated) {
                return _this.authService.autoLogin();
            }
            else {
                return of(isAuthenticated);
            }
        }), tap(function (isAuthenticated) {
            if (!isAuthenticated) {
                _this.router.navigateByUrl("/auth");
            }
        }));
    };
    AuthGuard = tslib_1.__decorate([
        Injectable({
            providedIn: "root"
        }),
        tslib_1.__metadata("design:paramtypes", [AuthService, Router])
    ], AuthGuard);
    return AuthGuard;
}());
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map
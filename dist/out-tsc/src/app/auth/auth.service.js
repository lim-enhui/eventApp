import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { BehaviorSubject, from } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Plugins } from "@capacitor/core";
import * as firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { Facebook } from "@ionic-native/facebook/ngx";
import { User } from "./user.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store } from "@ngrx/store";
import * as fromAppActions from "../store/app.actions";
var AuthService = /** @class */ (function () {
    function AuthService(afAuth, gplus, fb, afs, store) {
        this.afAuth = afAuth;
        this.gplus = gplus;
        this.fb = fb;
        this.afs = afs;
        this.store = store;
        this._user = new BehaviorSubject(null);
    }
    Object.defineProperty(AuthService.prototype, "userIsAuthenticated", {
        get: function () {
            return this._user.asObservable().pipe(map(function (user) {
                if (user) {
                    return !!user.token;
                }
                else {
                    return false;
                }
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthService.prototype, "userId", {
        get: function () {
            return this._user.asObservable().pipe(map(function (user) {
                if (user) {
                    return user.id;
                }
                else {
                    return null;
                }
            }));
        },
        enumerable: true,
        configurable: true
    });
    AuthService.prototype.nativeFacebookLogin = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, facebookCredential, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.fb.login(["email", "public_profile"])];
                    case 1:
                        response = _a.sent();
                        facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
                        return [4 /*yield*/, this.afAuth.auth.signInAndRetrieveDataWithCredential(facebookCredential)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_1 = _a.sent();
                        console.debug(err_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.nativeGoogleLogin = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var gplusUser, googleCredential, err_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.gplus.login({
                                webClientId: "1039533106471-k6qtkre986g4n6gaaguh953kmuce30v2.apps.googleusercontent.com",
                                offline: true,
                                scopes: "profile email"
                            })];
                    case 1:
                        gplusUser = _a.sent();
                        googleCredential = firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken);
                        return [4 /*yield*/, this.afAuth.auth.signInAndRetrieveDataWithCredential(googleCredential)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_2 = _a.sent();
                        console.debug(err_2);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.signup = function (email, password) {
        return from(this.afAuth.auth.createUserWithEmailAndPassword(email, password)).pipe(tap(this.setUserData.bind(this)));
    };
    AuthService.prototype.login = function (email, password) {
        return from(this.afAuth.auth.signInWithEmailAndPassword(email, password)).pipe(tap(this.setUserData.bind(this)));
    };
    AuthService.prototype.logout = function () {
        this._user.next(null);
        Plugins.Storage.remove({ key: "authData" });
    };
    AuthService.prototype.setUserData = function (userData, loginMethod) {
        var _this = this;
        if (loginMethod === void 0) { loginMethod = "default"; }
        this.userDoc = this.afs.doc("users/" + userData.user.uid);
        var expirationTime = new Date(new Date().getTime() + 3600 * 1000);
        console.log("userData");
        console.log(userData);
        this.afs.firestore
            .doc("/users/" + userData.user.uid)
            .get()
            .then(function (docSnapshot) {
            if (!docSnapshot.exists) {
                _this.userDoc.set({
                    uid: userData.user.uid,
                    displayName: userData.user.displayName,
                    photoUrl: userData.user.photoURL ? userData.user.photoURL : "",
                    email: userData.user.email,
                    phoneNumber: userData.user.phoneNumber
                });
            }
            else {
                if (loginMethod == "google" || loginMethod == "facebook") {
                    // this.userDoc.update({
                    //   displayName: userData.user.displayName,
                    //   photoUrl: userData.user.photoURL,
                    //   email: userData.user.email
                    // });
                }
            }
        });
        this.store.dispatch(fromAppActions.updateUserId({
            userId: userData.user.uid
        }));
        userData.user.getIdToken().then(function (idToken) {
            console.log(userData.user);
            _this._user.next(new User(userData.user.uid, userData.user.email, idToken, expirationTime));
            _this.storeAuthData(userData.user.uid, idToken, expirationTime.toISOString(), userData.user.email);
        });
    };
    AuthService.prototype.autoLogin = function () {
        var _this = this;
        return from(Plugins.Storage.get({ key: "authData" })).pipe(map(function (storedData) {
            if (!storedData || !storedData.value) {
                return null;
            }
            var parsedData = JSON.parse(storedData.value);
            var expirationTime = new Date(parsedData.tokenExpirationDate);
            if (expirationTime <= new Date()) {
                return null;
            }
            var user = new User(parsedData.userId, parsedData.email, parsedData.token, expirationTime);
            return user;
        }), tap(function (user) {
            if (user) {
                _this._user.next(user);
                _this.store.dispatch(fromAppActions.updateUserId({
                    userId: user.id
                }));
            }
        }), map(function (user) {
            return !!user;
        }));
    };
    AuthService.prototype.storeAuthData = function (userId, token, tokenExpirationDate, email) {
        var data = JSON.stringify({
            userId: userId,
            token: token,
            tokenExpirationDate: tokenExpirationDate,
            email: email
        });
        Plugins.Storage.set({ key: "authData", value: data });
    };
    AuthService = tslib_1.__decorate([
        Injectable({
            providedIn: "root"
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFireAuth,
            GooglePlus,
            Facebook,
            AngularFirestore,
            Store])
    ], AuthService);
    return AuthService;
}());
export { AuthService };
//# sourceMappingURL=auth.service.js.map
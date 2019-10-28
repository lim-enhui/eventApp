import { Injectable } from "@angular/core";
import { BehaviorSubject, from } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Plugins } from "@capacitor/core";

import * as firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { Facebook } from "@ionic-native/facebook/ngx";
import { User } from "./user.model";

import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";

export interface IUser {
  uid: string;
  displayName: string;
  photoUrl?: string;
  email: string;
  phoneNumber?: number | null | string;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);
  private userDoc: AngularFirestoreDocument<IUser>;
  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  constructor(
    private afAuth: AngularFireAuth,
    private gplus: GooglePlus,
    private fb: Facebook,
    private afs: AngularFirestore
  ) {}

  async nativeFacebookLogin() {
    try {
      const response = await this.fb.login(["email", "public_profile"]);
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
        response.authResponse.accessToken
      );
      return await this.afAuth.auth.signInAndRetrieveDataWithCredential(
        facebookCredential
      );
    } catch (err) {
      console.debug(err);
      return null;
    }
  }

  async nativeGoogleLogin() {
    try {
      const gplusUser = await this.gplus.login({
        webClientId:
          "1039533106471-k6qtkre986g4n6gaaguh953kmuce30v2.apps.googleusercontent.com",
        offline: true,
        scopes: "profile email"
      });
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(
        gplusUser.idToken
      );
      return await this.afAuth.auth.signInAndRetrieveDataWithCredential(
        googleCredential
      );
    } catch (err) {
      console.debug(err);
      return null;
    }
  }

  signup(email: string, password: string) {
    return from(
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    ).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return from(
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this._user.next(null);
    Plugins.Storage.remove({ key: "authData" });
  }

  setUserData(userData, loginMethod = "default") {
    this.userDoc = this.afs.doc<IUser>(`users/${userData.user.uid}`);
    const expirationTime = new Date(new Date().getTime() + 3600 * 1000);

    console.log("userData");
    console.log(userData);

    this.afs.firestore
      .doc(`/users/${userData.user.uid}`)
      .get()
      .then(docSnapshot => {
        if (!docSnapshot.exists) {
          this.userDoc.set({
            uid: userData.user.uid,
            displayName: userData.user.displayName,
            photoUrl: userData.user.photoURL ? userData.user.photoURL : "",
            email: userData.user.email,
            phoneNumber: userData.user.phoneNumber
          });
        } else {
          if (loginMethod == "google" || loginMethod == "facebook") {
            // this.userDoc.update({
            //   displayName: userData.user.displayName,
            //   photoUrl: userData.user.photoURL,
            //   email: userData.user.email
            // });
          }
        }
      });

    userData.user.getIdToken().then(idToken => {
      console.log(userData.user);
      this._user.next(
        new User(
          userData.user.uid,
          userData.user.email,
          idToken,
          expirationTime
        )
      );

      this.storeAuthData(
        userData.user.uid,
        idToken,
        expirationTime.toISOString(),
        userData.user.email
      );
    });
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: "authData" })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
        };

        const expirationTime = new Date(parsedData.tokenExpirationDate);

        if (expirationTime <= new Date()) {
          return null;
        }

        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId,
      token,
      tokenExpirationDate,
      email
    });
    Plugins.Storage.set({ key: "authData", value: data });
  }
}

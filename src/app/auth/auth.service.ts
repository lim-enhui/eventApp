import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

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

  constructor(private afAuth: AngularFireAuth,
              private gplus: GooglePlus,
              private fb: Facebook,) {}

  async nativeFacebookLogin() {
    try {
      const response = await this.fb.login(['email', 'public_profile'])
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      return await this.afAuth.auth.signInAndRetrieveDataWithCredential(facebookCredential);
    } catch (err) {
      console.debug(err);
      return null;
    }
  }

  async nativeGoogleLogin() {
    try{
      const gplusUser = await this.gplus.login({
        'webClientId': '1039533106471-k6qtkre986g4n6gaaguh953kmuce30v2.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      });
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken);
      return await this.afAuth.auth.signInAndRetrieveDataWithCredential(googleCredential);
    } catch (err) {
      console.debug(err);
      return null;
    }
  }

  signup(email: string, password: string) {
    return from(this.afAuth.auth.createUserWithEmailAndPassword(email, password))
            .pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return from(this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password))
            .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
  }

  setUserData(userData) {
    const expirationTime = new Date(new Date().getTime() + (3600 * 1000));
    console.log(userData);
    userData.user.getIdToken().then((idToken) => {
      this._user.next(
        new User(
          userData.user.uid, 
          userData.user.email, 
          idToken, 
          expirationTime));
      this.storeAuthData(
        userData.user.uid,
        idToken,
        expirationTime.toISOString(),
        userData.user.email
      );
    });
  }

  autoLogin() {
    return from(Plugins.Storage.get({key: 'authData'}))
      .pipe(
        map(storedData => {
          if(!storedData || !storedData.value) {
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
    })
    Plugins.Storage.set({key: 'authData', value: data});
  };
}

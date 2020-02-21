import { Component, OnInit } from "@angular/core";

import { Platform, MenuController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AuthService } from "./auth/auth.service";
import { Store } from "@ngrx/store";

import * as fromAppActions from "./store/app.actions";
import * as fromAppReducer from "./store/app.reducer";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from "@capacitor/core";

const { PushNotifications } = Plugins;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<fromAppReducer.AppState>,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public auth: AuthService,
    private menuController: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    console.log("App Initialization");
    this.store.dispatch(fromAppActions.loadGeoLocation());
    this.store.dispatch(fromAppActions.loadEvents());

    if (this.platform.is("capacitor")) {
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();

      // On success, we should be able to receive notifications
      PushNotifications.addListener(
        "registration",
        (token: PushNotificationToken) => {
          // alert("Push registration success, token: " + token.value);
          console.log(token.value);
          this.store.dispatch(
            fromAppActions.loadDeviceToken({ token: token.value })
          );
        }
      );

      // Some issue with our setup and push will not work
      PushNotifications.addListener("registrationError", (error: any) => {
        // alert("Error on registration: " + JSON.stringify(error));
      });

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener(
        "pushNotificationReceived",
        (notification: PushNotification) => {
          alert("Push received: " + JSON.stringify(notification));
        }
      );

      // Method called when tapping on a notification
      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification: PushNotificationActionPerformed) => {
          alert("Push action performed: " + JSON.stringify(notification));
        }
      );
    }
  }

  closeMenu() {
    this.menuController.close();
  }

  signOut() {
    this.auth.logout();
    this.menuController.close();
  }
}

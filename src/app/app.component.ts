import { Component, OnInit } from "@angular/core";

import { Platform, MenuController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AuthService } from "./auth/auth.service";
import { GeolocationService } from "./shared/geolocation.service";
import { Store } from "@ngrx/store";

import * as fromAppActions from "./store/app.actions";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<any>,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public auth: AuthService,
    private menuController: MenuController,
    private geolocationService: GeolocationService
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
  }

  closeMenu() {
    this.menuController.close();
  }

  signOut() {
    this.auth.logout();
    this.menuController.close();
  }
}

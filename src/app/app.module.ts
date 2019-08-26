import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFirestoreModule } from "@angular/fire/firestore";

import { Facebook } from "@ionic-native/facebook/ngx";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { QRScanner } from "@ionic-native/qr-scanner/ngx";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";

const firebaseConfig = {
  apiKey: "AIzaSyDX878vWfnXaGwPKAM_WJ_BgWnwhIv3v20",
  authDomain: "eventapp-347e0.firebaseapp.com",
  databaseURL: "https://eventapp-347e0.firebaseio.com",
  projectId: "eventapp-347e0",
  storageBucket: "eventapp-347e0.appspot.com",
  messagingSenderId: "1039533106471"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    QRScanner,
    Facebook,
    FileOpener,
    FileTransfer,
    File,
    CallNumber,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

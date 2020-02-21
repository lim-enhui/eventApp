import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireFunctionsModule } from "@angular/fire/functions";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { QRScanner } from "@ionic-native/qr-scanner/ngx";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { Facebook } from "@ionic-native/facebook/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { FileChooser } from "@ionic-native/file-chooser/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { YoutubeVideoPlayer } from "@ionic-native/youtube-video-player/ngx";
import { Camera } from "@ionic-native/camera/ngx";
import { Contacts } from "@ionic-native/contacts/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { GeolocationService } from "./shared/geolocation.service";
import { NativeHelpersService } from "./shared/native-helpers.service";

import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import * as fromAppReducer from "./store/app.reducer";
import { AppEffect } from "./store/app.effects";

import { QrCodePage } from "./qr-code/qr-code.page";
import { QRCodeModule } from "angularx-qrcode";
import { UserCardPage } from "./user-card/user-card.page";

const firebaseConfig = {
  apiKey: "AIzaSyDX878vWfnXaGwPKAM_WJ_BgWnwhIv3v20",
  authDomain: "eventapp-347e0.firebaseapp.com",
  databaseURL: "https://eventapp-347e0.firebaseio.com",
  projectId: "eventapp-347e0",
  storageBucket: "eventapp-347e0.appspot.com",
  messagingSenderId: "1039533106471"
};

@NgModule({
  declarations: [AppComponent, QrCodePage, UserCardPage],
  entryComponents: [QrCodePage, UserCardPage],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ app: fromAppReducer.appReducer }),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([AppEffect]),
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireFunctionsModule,
    QRCodeModule
  ],
  providers: [
    StatusBar,
    GeolocationService,
    NativeHelpersService,
    SplashScreen,
    GooglePlus,
    QRScanner,
    Facebook,
    FileOpener,
    FileTransfer,
    FileChooser,
    File,
    CallNumber,
    Contacts,
    Geolocation,
    SocialSharing,
    YoutubeVideoPlayer,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

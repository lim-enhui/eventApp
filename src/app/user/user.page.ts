import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ModalController } from "@ionic/angular";

import { QrCodePage } from "../qr-code/qr-code.page";
import { Router } from "@angular/router";

import { Store, select } from "@ngrx/store";

import * as fromAppReducer from "../store/app.reducer";

import { AngularFirestore } from "@angular/fire/firestore";
import { switchMap } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { eventsJoin } from "../utils/join.utils";
import { IEvent } from "../model/event.interface";

@Component({
  selector: "app-user",
  templateUrl: "./user.page.html",
  styleUrls: ["./user.page.scss"]
})
export class UserPage implements OnInit {
  public userId: string;
  public userDisplayName: string;
  public userEmail: string;
  public userImage: string;
  public userCompany: string;
  public userSchool: string;
  public userAtLocation: string;
  public events: Array<IEvent>;

  constructor(
    private http: HttpClient,
    public modalController: ModalController,
    private router: Router,
    private store: Store<fromAppReducer.AppState>,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.store
      .pipe(
        select(fromAppReducer.selectGeolocation),
        switchMap(location => {
          return this.http.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${environment.firebaseAPIKey}`
          );
        })
      )
      .subscribe(location => {
        console.log(location["results"]);
        let results: Array<any> = location["results"];
        this.userAtLocation = results[0].formatted_address;
        console.log(this.userAtLocation);
      });
  }

  ionViewWillEnter() {
    this.loadUser();

    this.afs.firestore
      .doc(`users/${this.userId}/private/events`)
      .get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          console.log("exists");
          this.afs
            .doc(`users/${this.userId}/private/events`)
            .valueChanges()
            .pipe(eventsJoin(this.afs))
            .subscribe((events: Array<IEvent>) => {
              console.log(events);
              this.events = events;
            });
        } else {
          console.log("not exists");
          this.afs.doc(`users/${this.userId}/private/events`).set({
            createdevents: []
          });
        }
      });
  }

  loadUser() {
    this.store
      .pipe(select(fromAppReducer.selectUserId))
      .subscribe(userId => (this.userId = userId));

    this.afs
      .doc<{ photoUrl: string; displayName: string; email: string }>(
        `users/${this.userId}`
      )
      .valueChanges()
      .subscribe(userData => {
        console.log(userData);
        this.userImage =
          userData.photoUrl === ""
            ? "assets/img/default_profile.jpg"
            : userData.photoUrl;
        this.userDisplayName =
          userData.displayName === null || userData.displayName === ""
            ? "Anonymous"
            : userData.displayName;
        this.userEmail = userData.email;
      });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: QrCodePage,
      componentProps: {
        item: {
          id: this.userId,
          type: "contact"
        }
      }
    });
    return await modal.present();
  }

  navigateTo(page) {
    const url = "/" + page;
    this.router.navigate([url]);
  }
}

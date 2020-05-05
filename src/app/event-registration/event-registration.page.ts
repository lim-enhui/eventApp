import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IEvent } from "../model/event.interface";
import { mergeMap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { IUser } from "../model/user.interface";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as firebase from "firebase";
import { Router } from "@angular/router";

import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { NativeHelpersService } from "../shared/native-helpers.service";

@Component({
  selector: "app-event-registration",
  templateUrl: "./event-registration.page.html",
  styleUrls: ["./event-registration.page.scss"],
  providers: []
})
export class EventRegistrationPage implements OnInit {
  public latitude: number;
  public longitude: number;
  public event: IEvent;
  public eventUser: IUser;
  public userId: string;

  public defaultImage: string = "assets/img/default.jpg";

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private socialSharing: SocialSharing,
    private nativeHelpersService: NativeHelpersService,
    private router: Router,
    private store: Store<fromAppReducer.AppState>
  ) {}

  ngOnInit() {
    this.store
      .pipe(select(fromAppReducer.selectUserId))
      .subscribe(userId => (this.userId = userId));

    this.route.paramMap
      .pipe(
        mergeMap((route: any) => {
          this.event = Object.assign({}, route.params);
          this.latitude = +route.params.eventlat;
          this.longitude = +route.params.eventlng;

          return this.afs.doc(`users/${route.params.creator}`).valueChanges();
        })
      )
      .subscribe((user: IUser) => {
        this.eventUser = user;
      });
  }

  ionViewWillEnter() {}

  onClick(type) {
    if (type === "email") {
      console.log("email");
      this.socialSharing
        .canShareViaEmail()
        .then(() => {
          // Sharing via email is possible
          // Share via email
          console.log("can share by email");
          this.socialSharing.shareViaEmail("", "from eventApp", [
            this.eventUser.email
          ]);
        })
        .catch(() => {
          // Sharing via email is not possible
          console.error("error");
        });
    } else if (type === "call") {
      this.nativeHelpersService
        .callContact(this.eventUser.phoneNumber.toString())
        .then(res => console.log("Launched dialer!", res))
        .catch(err => console.log("Error launching dialer", err));
    } else {
      console.log("message");
      this.textContact(this.eventUser.uid);
    }
  }

  textContact(userId) {
    console.log(userId);
    // this.navigateTo("message/9K257FZcnOX6pBAJ0XDz");
    this.afs
      .collection(`message`)
      .add({
        chats: [],
        recipients: [userId, this.userId]
      })
      .then(doc => {
        console.log(doc);
        this.afs.firestore
          .doc(`users/${this.userId}/private/inbox`)
          .get()
          .then(docSnapshot => {
            if (docSnapshot.exists) {
              this.afs.doc(`users/${this.userId}/private/inbox`).update({
                messages: firebase.firestore.FieldValue.arrayUnion(doc.id)
              });
            } else {
              this.afs.doc(`users/${this.userId}/private/inbox`).set({
                messages: firebase.firestore.FieldValue.arrayUnion(doc.id)
              });
            }

            this.navigateTo(`message/${doc.id}`);
          });
      });
  }

  navigateTo(page) {
    const url = "/" + page;
    console.log(url);
    this.router.navigate([url]);
  }
}

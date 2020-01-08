import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { IEvent } from "../model/event.interface";
import { mergeMap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { IUser } from "../model/user.interface";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";

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
  public user: IUser;

  public defaultImage: string = "assets/img/default.jpg";

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private socialSharing: SocialSharing,
    private callNumber: CallNumber
  ) {}

  ngOnInit() {
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
        this.user = user;
        console.log(this.user);
      });
  }

  ionViewWillEnter() {}

  callContact(contactNumber) {
    this.callNumber
      .callNumber(contactNumber, true)
      .then(res => console.log("Launched dialer!", res))
      .catch(err => console.log("Error launching dialer", err));
  }

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
            this.user.email
          ]);
        })
        .catch(() => {
          // Sharing via email is not possible
          console.error("error");
        });
    } else if (type === "call") {
      this.callNumber
        .callNumber(this.user.phoneNumber.toString(), true)
        .then(res => console.log("Launched dialer!", res))
        .catch(err => console.log("Error launching dialer", err));
    } else {
      console.log("message");
    }
  }
}

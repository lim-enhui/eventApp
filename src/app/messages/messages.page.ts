import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NavController } from "@ionic/angular";
import { AuthService } from "../auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { shareReplay, combineLatest, map } from "rxjs/operators";
import {
  leftJoinCollection,
  leftJoinDocument,
  testJoinDocument,
  outerJoinDocument
} from "../utils/utils";
import { State } from "@ngrx/store";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.page.html",
  styleUrls: ["./messages.page.scss"]
})
export class MessagesPage implements OnInit {
  contacts;

  constructor(
    private httpClient: HttpClient,
    private navCtrl: NavController,
    private authService: AuthService,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.authService.userId.subscribe(userId => {
      // this.loadMessages(userId);
      this.testCallFunction();
    });
  }

  testCallFunction() {
    this.afs
      .doc("test-users/jeff")
      .valueChanges()
      .pipe(
        testJoinDocument(this.afs, {
          location: "test-countries",
          pet: "test-pets"
        }),
        shareReplay(1)
      )
      .subscribe(console.log);
  }

  loadMessages(userId) {
    // this.httpClient
    //   .get("https://randomuser.me/api/?results=4")
    //   .subscribe(res => {
    //     this.contacts = res["results"];
    //     console.log(typeof this.contacts);
    //     console.log(this.contacts);
    //   });

    this.afs
      .doc("users/7tfM8zo9Ayennm9euxov13AgUQ53/private/inbox")
      .valueChanges()
      .pipe(
        outerJoinDocument(this.afs, { messages: "message", uid: "users" }),
        shareReplay(1),
        map(data => {
          console.log(data);
          return data;
        })
      )
      .subscribe(
        (payload: {
          messages: Array<{
            id: string;
            chats: Array<{ content: string; createdAt: number; uid: any }>;
          }>;
        }) => {
          console.log(payload);
        }
      );
    // this.afs
    //   .collection("test-users")
    //   .valueChanges()
    //   .pipe(leftJoinCollection(this.afs, "userId", "test-orders"))
    //   .subscribe(console.log);
    // this.afs
    //   .collection("test-users")
    //   .valueChanges()
    //   .pipe(leftJoinDocument(this.afs, "location", "test-countries"))
    //   .subscribe(console.log);
  }

  getMessage(id) {
    return this.afs
      .collection("message")
      .doc(id)
      .valueChanges();
  }

  openMessage() {
    console.log("Open Message");
    this.navCtrl.navigateForward("/message");
  }

  navigateTo(url) {
    this.navCtrl.navigateForward("/" + url);
  }
}

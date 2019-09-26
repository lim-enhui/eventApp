import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NavController } from "@ionic/angular";
import { AuthService } from "../auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { combineLatest, map, switchMap } from "rxjs/operators";

import { State } from "@ngrx/store";
import { Observable, ObservableInput, of, defer } from "rxjs";

import { messagesJoin } from "../utils/utils";

@Component({
  selector: "app-messages",
  // templateUrl: "./messages.page.html",
  template: `
    <h1>Testing</h1>
  `,
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
      this.loadMessages(userId);
    });
  }

  testCallFunction() {}

  loadMessages(userId) {
    this.afs
      .doc(`users/${userId}/private/inbox`)
      .valueChanges()
      .pipe(messagesJoin(this.afs))
      .subscribe(console.log);
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

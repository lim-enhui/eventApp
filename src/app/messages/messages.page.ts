import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NavController } from "@ionic/angular";
import { AuthService } from "../auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";

import { messagesJoin } from "../utils/join.utils";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.page.html",
  styleUrls: ["./messages.page.scss"]
})
export class MessagesPage implements OnInit {
  public messages = [];
  public userId: string;

  constructor(
    private store: Store<fromAppReducer.AppState>,
    private navCtrl: NavController,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    console.log("ion enter");
    this.store.pipe(select(fromAppReducer.selectUserId)).subscribe(userId => {
      this.userId = userId;
      this.loadMessages(userId);
      // this.afs
      //   .doc(`users/${userId}/private/inbox`)
      //   .valueChanges()
      //   .pipe(messagesJoin(this.afs))
      //   .subscribe((data: any) => {
      //     // this.messages = data.messages;
      //     console.log(data);
      //   });
    });
  }

  ionViewWillLeave() {
    console.log("ion leave");
  }

  loadMessages(userId) {
    this.afs.firestore
      .doc(`users/${userId}/private/inbox`)
      .get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          this.afs
            .doc(`users/${userId}/private/inbox`)
            .valueChanges()
            .pipe(messagesJoin(this.afs))
            .subscribe((data: any) => {
              this.messages = data.messages;
            });
        } else {
          this.afs.doc(`users/${userId}/private/inbox`).set({
            messages: []
          });
        }
      });
  }

  openMessage(id) {
    console.log("Open Message");
    this.navCtrl.navigateForward("/message/" + id);
  }

  navigateTo(url) {
    this.navCtrl.navigateForward("/" + url);
  }
}

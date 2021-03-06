import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as fromAppActions from "../store/app.actions";

import { Router } from "@angular/router";
import { IMessage } from "../model/message.interface";
import * as firebase from "firebase";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.page.html",
  styleUrls: ["./messages.page.scss"]
})
export class MessagesPage implements OnInit {
  public messages: Array<IMessage>;
  public userId: string;
  public defaultImage: string = "assets/img/default_profile.jpg";

  constructor(
    private store: Store<fromAppReducer.AppState>,
    private navCtrl: NavController,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.store.pipe(select(fromAppReducer.selectUserId)).subscribe(userId => {
      this.userId = userId;
    });

    this.store
      .pipe(select(fromAppReducer.selectMessages))
      .subscribe((messages: IMessage[]) => {
        this.messages = messages;
      });
  }

  ionViewWillEnter() {
    console.log("ion enter");
    this.store.dispatch(fromAppActions.loadMessages());
  }

  openMessage(id) {
    console.log("Open Message");
    this.router.navigate(["/message/" + id]);
  }

  deleteMessage(id, bool: boolean = false) {
    console.log(id);
    this.afs
      .doc(`users/${this.userId}/private/inbox`)
      .update({
        messages: firebase.firestore.FieldValue.arrayRemove(id)
      })
      .then(() => {
        if (bool) {
          // if it is true, it implies message is empty.
          // safe to delete
          this.afs.doc(`message/${id}`).delete();
        }
        this.store.dispatch(fromAppActions.loadMessages());
      });
  }

  navigateTo(url) {
    console.log("navigate forward");
    this.navCtrl.navigateForward("/" + url);
  }
}

import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as fromAppActions from "../store/app.actions";

import { messagesJoin } from "../utils/join.utils";
import { Router } from "@angular/router";
import { IMessage } from "../model/message.interface";

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

  navigateTo(url) {
    this.navCtrl.navigateForward("/" + url);
  }
}

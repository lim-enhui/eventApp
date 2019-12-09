import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NavController } from "@ionic/angular";
import { AuthService } from "../auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";

import { messagesJoin } from "../utils/utils";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.page.html",
  styleUrls: ["./messages.page.scss"]
})
export class MessagesPage implements OnInit {
  public messages;

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
      .subscribe((data: any) => {
        this.messages = data.messages;
      });
  }

  getMessage(id) {
    return this.afs
      .collection("message")
      .doc(id)
      .valueChanges();
  }

  openMessage(id) {
    console.log("Open Message");
    this.navCtrl.navigateForward("/message/" + id);
  }

  navigateTo(url) {
    this.navCtrl.navigateForward("/" + url);
  }
}

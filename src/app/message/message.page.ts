import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";

import { AngularFirestore } from "@angular/fire/firestore";
import { firestore } from "firebase";
import { ActivatedRoute } from "@angular/router";
import { messageJoin } from "../utils/join.utils";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as firebase from "firebase";
import { IUser } from "../model/user.interface";
import { NavController } from "@ionic/angular";
import * as fromAppActions from "../store/app.actions";
import { IChat } from "../model/message.interface";

@Component({
  selector: "app-message",
  templateUrl: "./message.page.html",
  styleUrls: ["./message.page.scss"]
})
export class MessagePage implements OnInit, AfterViewInit {
  public messages: Array<IChat>;
  public editorMsg: string;
  public messageId: string;
  public userId: string;
  public boolAddUserToMessage: boolean = false;
  public recipient: IUser;

  @ViewChild("messageContainer", { static: false }) messageContainer;

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private store: Store<fromAppReducer.AppState>
  ) {}

  ngAfterViewInit() {
    console.log(this.messageContainer);
    this.messageContainer.scrollToBottom();
  }

  ngOnInit() {
    this.store
      .pipe(select(fromAppReducer.selectUserId))
      .subscribe(userId => (this.userId = userId));

    this.route.paramMap.subscribe(params => {
      this.messageId = params.get("id");
    });

    this.afs
      .doc(`message/${this.messageId}`)
      .valueChanges()
      .pipe(messageJoin(this.afs))
      .subscribe((response: any) => {
        this.messages = response.chats;
        this.messageContainer.scrollToBottom();
        if (response.chats.length === 0) {
          this.boolAddUserToMessage = true;
          let recipientIndex = response.recipients.findIndex(el => {
            return el.uid !== this.userId;
          });

          let recipientIdArray = response.recipients.splice(recipientIndex, 1);
          this.recipient = recipientIdArray.pop();
        }
      });
  }

  ionViewDidEnter() {
    this.messageContainer.scrollToBottom();
  }

  navigateTo(url) {
    this.store.dispatch(fromAppActions.loadMessages());
    this.navCtrl.navigateRoot(["/" + url]);
  }

  async sendMsg() {
    console.log(this.editorMsg);
    // let chatId = "6rMqgiaCczSQlnuW78Fh";
    const data = {
      uid: this.userId,
      content: this.editorMsg,
      createdAt: Date.now()
    };

    if (this.boolAddUserToMessage) {
      this.afs.firestore
        .doc(`users/${this.recipient.uid}/private/inbox`)
        .get()
        .then(docSnapshot => {
          if (docSnapshot.exists) {
            this.afs.doc(`users/${this.recipient.uid}/private/inbox`).update({
              messages: firebase.firestore.FieldValue.arrayUnion(this.messageId)
            });
          } else {
            this.afs.doc(`users/${this.recipient.uid}/private/inbox`).set({
              messages: [this.messageId]
            });
          }
        });
    }

    const ref = this.afs.collection("message").doc(this.messageId);
    ref.update({
      chats: firestore.FieldValue.arrayUnion(data)
    });

    this.messageContainer.scrollToBottom();
    this.editorMsg = "";
  }
}

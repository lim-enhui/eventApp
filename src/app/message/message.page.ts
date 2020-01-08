import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";

import { of } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { firestore } from "firebase";
import { ActivatedRoute } from "@angular/router";
import { mergeMap } from "rxjs/operators";
import { messageJoin } from "../utils/join.utils";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as firebase from "firebase";
import { IUser } from "../model/user.interface";

@Component({
  selector: "app-message",
  templateUrl: "./message.page.html",
  styleUrls: ["./message.page.scss"]
})
export class MessagePage implements OnInit, AfterViewInit {
  public messages: Array<any>;
  public editorMsg: string;
  public messageId: string;
  public userId: string;
  public boolAddUserToMessage: boolean = false;
  public recipient: IUser;

  @ViewChild("messageContainer", { static: false }) messageContainer;

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
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
        console.log(response);
        this.messages = response.chats;
        console.log(response.chats);
        if (response.chats.length === 0) {
          this.boolAddUserToMessage = true;
          let recipientIndex = response.recipients.findIndex(el => {
            console.log(el);
            console.log(this.userId);
            return el.uid !== this.userId;
          });

          console.log(recipientIndex);
          let recipientIdArray = response.recipients.splice(recipientIndex, 1);
          console.log(recipientIdArray);
          this.recipient = recipientIdArray.pop();
          console.log(this.recipient.uid);
        }
      });
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
            this.afs.doc(`users/${this.userId}/private/inbox`).set({
              messages: [this.messageId]
            });
          }
        });
    }

    const ref = this.afs.collection("message").doc(this.messageId);
    ref.update({
      chats: firestore.FieldValue.arrayUnion(data)
    });

    this.editorMsg = "";
  }
}

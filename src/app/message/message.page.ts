import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";

import { of } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { firestore } from "firebase";

@Component({
  selector: "app-message",
  templateUrl: "./message.page.html",
  styleUrls: ["./message.page.scss"]
})
export class MessagePage implements OnInit, AfterViewInit {
  public messages: Array<any>;
  public editorMsg: string;

  @ViewChild("messageContainer", { static: false }) messageContainer;

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore
  ) {}

  ngAfterViewInit() {
    console.log(this.messageContainer);
    this.messageContainer.scrollToBottom();
  }

  ngOnInit() {
    const source = of([
      {
        user: "me",
        message: "Hello",
        timestamp: "11 Jan 2019 11:00pm"
      },
      {
        user: "friend",
        message: "Hello",
        timestamp: "11 Jan 2019 11:01pm"
      },
      {
        user: "me",
        message:
          "How are you? I am going to start writing nonsense to better guage the UI.",
        timestamp: "11 Jan 2019 11:02pm"
      },
      {
        user: "friend",
        timestamp: "11 Jan 2019 11:03pm",
        message:
          "I'm fine. I am going to type a really long text to see how would the interface be like."
      },
      {
        user: "me",
        message: "Hello",
        timestamp: "11 Jan 2019 11:04pm"
      },
      {
        user: "friend",
        message: "Hello",
        timestamp: "11 Jan 2019 11:05pm"
      },
      {
        user: "me",
        timestamp: "11 Jan 2019 11:06pm",
        message:
          "How are you? I am going to start writing nonsense to better guage the UI."
      },
      {
        user: "friend",
        timestamp: "11 Jan 2019 11:07pm",
        message:
          "I'm fine. I am going to type a really long text to see how would the interface be like."
      }
    ]);

    source.subscribe(response => {
      this.messages = response;
    });
  }

  async sendMsg() {
    console.log(this.editorMsg);
    let chatId = "6rMqgiaCczSQlnuW78Fh";
    this.authService.userId.subscribe(uid => {
      const data = {
        uid,
        content: this.editorMsg,
        createdAt: Date.now()
      };
      console.log(uid);
      if (uid) {
        const ref = this.afs.collection("message").doc(chatId);
        return ref.update({
          chats: firestore.FieldValue.arrayUnion(data)
        });
      }
    });

    this.editorMsg = "";
  }
}

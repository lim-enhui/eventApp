import { Component, OnInit } from "@angular/core";
import { of } from "rxjs";

@Component({
  selector: "app-message",
  templateUrl: "./message.page.html",
  styleUrls: ["./message.page.scss"]
})
export class MessagePage implements OnInit {
  messages: Array<any>;

  constructor() {}

  ngOnInit() {
    const source = of([
      {
        user: "me",
        message: "Hello"
      },
      {
        user: "friend",
        message: "Hello"
      },
      {
        user: "me",
        message: "How are you?"
      },
      {
        user: "friend",
        message: "I'm fine."
      }
    ]);

    source.subscribe(response => {
      this.messages = response;
    });
  }
}

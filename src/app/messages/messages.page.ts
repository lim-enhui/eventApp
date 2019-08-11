import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.page.html",
  styleUrls: ["./messages.page.scss"]
})
export class MessagesPage implements OnInit {
  contacts;

  constructor(private http: HttpClient, private navCtrl: NavController) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.http.get("https://randomuser.me/api/?results=4").subscribe(res => {
      this.contacts = res["results"];
      console.log(this.contacts);
    });
  }

  openMessage() {
    console.log("Open Message");
    this.navCtrl.navigateForward("/message");
  }
}

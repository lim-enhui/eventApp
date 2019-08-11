import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ModalController } from "@ionic/angular";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { QrCodePage } from "../qr-code/qr-code.page";

@Component({
  selector: "app-user",
  templateUrl: "./user.page.html",
  styleUrls: ["./user.page.scss"]
})
export class UserPage implements OnInit {
  user$: Observable<any>;

  constructor(
    private http: HttpClient,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.user$ = this.http
      .get("https://randomuser.me/api")
      .pipe(map(res => res["results"]));
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: QrCodePage
    });
    return await modal.present();
  }
}

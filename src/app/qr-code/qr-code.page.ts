import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { tryParseJSON } from "../utils/utils";

@Component({
  selector: "app-qr-code",
  templateUrl: "./qr-code.page.html",
  styleUrls: ["./qr-code.page.scss"]
})
export class QrCodePage implements OnInit {
  //  title = "app";
  //   elementType = "url";
  public scannedItem: any;

  constructor(
    public modalController: ModalController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    console.log(this.navParams);
    let item = this.navParams.get("item");
    this.scannedItem = JSON.stringify(item);
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }
}

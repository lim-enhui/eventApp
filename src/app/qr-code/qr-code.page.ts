import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-qr-code",
  templateUrl: "./qr-code.page.html",
  styleUrls: ["./qr-code.page.scss"]
})
export class QrCodePage implements OnInit {
  title = "app";
  elementType = "url";
  value = "Techiediaries";

  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }
}

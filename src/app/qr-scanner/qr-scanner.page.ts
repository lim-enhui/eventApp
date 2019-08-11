import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActionSheetController } from "@ionic/angular";

import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";
import { Router } from "@angular/router";

@Component({
  selector: "app-qr-scanner",
  templateUrl: "./qr-scanner.page.html",
  styleUrls: ["./qr-scanner.page.scss"]
})
export class QrScannerPage implements OnInit {
  isOn = false;
  scannedData: {};

  constructor(
    private qrScanner: QRScanner,
    public actionSheetController: ActionSheetController,
    private router: Router
  ) {}

  showCamera() {
    (window.document.querySelector("html") as HTMLElement).classList.add(
      "cameraView"
    );
  }

  hideCamera() {
    (window.document.querySelector("html") as HTMLElement).classList.remove(
      "cameraView"
    );
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Albums",
      buttons: [
        {
          text: "Delete",
          role: "destructive",
          icon: "trash",
          handler: () => {
            console.log("Delete clicked");
          }
        },
        {
          text: "Open",
          icon: "open",
          handler: () => {
            console.log("Open File clicked");
          }
        },
        {
          text: "Save into Folder",
          icon: "folder-open",
          handler: () => {
            console.log("Play clicked");
            this.router.navigate(["/tabs/my-folder"]);
          }
        },
        {
          text: "Favorite",
          icon: "heart",
          handler: () => {
            console.log("Favorite clicked");
          }
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    await actionSheet.present();
  }

  ionViewWillEnter() {
    this.showCamera();
    this.initQRScanner();
  }

  initQRScanner() {
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.isOn = true;

          // start scanning
          const scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log("Scanned something", text);

            this.isOn = false;

            this.presentActionSheet();

            this.qrScanner.hide().then();
            scanSub.unsubscribe();
          });

          this.qrScanner.show().then();
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
          this.qrScanner.openSettings();
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log("Error is", e));
  }

  ngOnInit() {}

  ionViewWillLeave() {
    this.qrScanner.pausePreview();
    this.qrScanner.hide();
    this.hideCamera();
  }
}

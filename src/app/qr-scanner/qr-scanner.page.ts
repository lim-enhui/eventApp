import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActionSheetController } from "@ionic/angular";

import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-qr-scanner",
  templateUrl: "./qr-scanner.page.html",
  styleUrls: ["./qr-scanner.page.scss"]
})
export class QrScannerPage implements OnInit {
  public isOn: boolean = false;
  public scannedData: any = {};
  public isScanning$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public reInitProcessNextActionSheet: boolean = false;
  public isFlashLightOn: boolean = false;

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

  async presentProcessNextActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Item Collection",
      backdropDismiss: false,
      buttons: [
        {
          text: "Open",
          icon: "open",
          handler: () => {
            console.log("open clicked");
            this.reInitProcessNextActionSheet = true;
          }
        },
        {
          text: "Add To Collection",
          icon: "bookmark",
          handler: () => {
            console.log("Add to Collection clicked");
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

    actionSheet.onDidDismiss().then(() => {
      if (this.reInitProcessNextActionSheet) {
        console.log("open Item");
      }
    });

    await actionSheet.present();
  }

  async presentRescanActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Item Collection",
      backdropDismiss: false,
      buttons: [
        {
          text: "Rescan",
          icon: "arrow-dropright-circle",
          handler: () => {
            console.log("Rescan clicked");
            this.initQRScanner();
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
    this.isScanning$.next(true);
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.isOn = true;

          // start scanning
          const scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log("Scanned something", text);

            this.isOn = false;

            this.presentProcessNextActionSheet();

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

  ngOnInit() {
    this.isScanning$.subscribe(bool => {
      bool
        ? console.log("isScanning ", bool)
        : this.presentProcessNextActionSheet();
    });
  }

  toggleFlashLight() {
    this.isFlashLightOn = !this.isFlashLightOn;
    if (this.isFlashLightOn) {
      this.qrScanner.enableLight();
    } else {
      this.qrScanner.disableLight();
    }
  }

  ionViewWillLeave() {
    this.qrScanner.pausePreview();
    this.qrScanner.hide();
    this.hideCamera();
  }

  navigateTo(page) {
    const url = "/" + page;
    console.log(url);
    this.router.navigate([url]);
  }
}

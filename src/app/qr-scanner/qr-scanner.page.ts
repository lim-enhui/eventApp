import { Component, OnInit } from "@angular/core";
import { ActionSheetController, Platform } from "@ionic/angular";
import { AngularFireStorage } from "@angular/fire/storage";

import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { File } from "@ionic-native/file/ngx";

import { Router } from "@angular/router";

import { sleeper } from "../utils/utils";

@Component({
  selector: "app-qr-scanner",
  templateUrl: "./qr-scanner.page.html",
  styleUrls: ["./qr-scanner.page.scss"]
})
export class QrScannerPage implements OnInit {
  public isOn: boolean = false;
  public scannedData: any = {};
  public isLoading: boolean;

  // public reInitProcessNextActionSheet: boolean = false;
  public isFlashLightOn: boolean = false;
  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(
    public platform: Platform,
    private qrScanner: QRScanner,
    private storage: AngularFireStorage,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private file: File
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

  async dlOpenImageFile() {
    console.log("dispatch loading true and is downloading");
    // this.store.dispatch(fromAppActions.updateQRLoading({ loading: true }));

    const ref = this.storage.ref("test.jpeg");
    const uri = await ref.getDownloadURL().toPromise();

    this.fileTransfer
      .download(uri, this.file.dataDirectory + "test.jpeg")
      .then(
        entry => {
          const locale_file = entry.toURL();
          console.log("download complete: " + locale_file);
          console.log("dispatch loading false");
          // this.store.dispatch(fromAppActions.updateQRLoading({ loading: false }));
          this.fileOpener
            .open(locale_file, "image/jpeg")
            .then(() => {
              console.log("File is opened");
            })
            .catch(e => console.log("Error opening file", e));
        },
        error => {
          // handle error
          // this.store.dispatch(fromAppActions.updateQRLoading({ loading: false }));
          throw Error("Unable to download file.");
        }
      )
      .then(() => {
        sleeper(1000);
      })
      .then(() => {
        this.presentProcessNextActionSheet();
      });
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
            this.dlOpenImageFile();
            actionSheet.dismiss();
          }
        },
        {
          text: "Rescan",
          icon: "arrow-dropright-circle",
          handler: () => {
            console.log("Rescan clicked");
            console.log("should scan");
            actionSheet.dismiss();
            this.showCamera();
            this.initQRScanner();
          }
        },
        {
          text: "Add To Collection",
          icon: "bookmark",
          handler: () => {
            console.log("Add to Collection clicked");
            actionSheet.dismiss();
            this.router.navigateByUrl("/tabs/my-folder");
          }
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
            actionSheet.dismiss();
            this.router.navigateByUrl("/tabs/home");
          }
        }
      ]
    });

    // actionSheet.onDidDismiss().then(() => {
    //   if (this.reInitProcessNextActionSheet) {
    //     console.log("open Item");
    //   }
    // });

    await actionSheet.present();
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
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

  ngOnInit() {}

  toggleFlashLight() {
    this.isFlashLightOn = !this.isFlashLightOn;
    if (this.isFlashLightOn) {
      this.qrScanner.enableLight();
    } else {
      this.qrScanner.disableLight();
    }
  }

  ionViewWillLeave() {
    console.log("ionViewWillLeave");
    this.qrScanner.pausePreview();
    this.qrScanner.hide();
    this.hideCamera();
  }

  ionViewDidLeave() {
    console.log("ionViewDidLeave");
  }

  navigateTo(page) {
    const url = "/" + page;
    console.log(url);
    this.router.navigate([url]);
  }
}

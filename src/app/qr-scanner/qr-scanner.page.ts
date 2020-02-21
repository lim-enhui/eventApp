import { Component, OnInit } from "@angular/core";
import {
  ActionSheetController,
  Platform,
  ModalController,
  NavController
} from "@ionic/angular";

import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { File } from "@ionic-native/file/ngx";

import { Router } from "@angular/router";

import { sleeper, tryParseJSON } from "../utils/utils";
import { NativeHelpersService } from "../shared/native-helpers.service";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase";

import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import { UserCardPage } from "../user-card/user-card.page";

@Component({
  selector: "app-qr-scanner",
  templateUrl: "./qr-scanner.page.html",
  styleUrls: ["./qr-scanner.page.scss"]
})
export class QrScannerPage implements OnInit {
  public isQRScanning: boolean = false;
  public scannedData: any;
  public isLoading: boolean;
  public userId: string;

  // public reInitProcessNextActionSheet: boolean = false;
  public isFlashLightOn: boolean = false;
  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(
    public platform: Platform,
    private qrScanner: QRScanner,
    public actionSheetController: ActionSheetController,
    private nativeHelpersService: NativeHelpersService,
    private store: Store<fromAppReducer.AppState>,
    private router: Router,
    private navCtrl: NavController,
    private afs: AngularFirestore,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private file: File,
    public modalController: ModalController
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

  async openScannedItem(item) {
    console.log("dispatch loading true and is downloading");
    let uri: any;
    let locale_file;

    if (item.type !== "youtube") {
      uri = await this.nativeHelpersService.downloadFileHelper(item);
      locale_file = uri.toURL();
    }

    switch (item.type) {
      case "powerpoint":
        this.fileOpener
          .open(
            locale_file,
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          )
          .then(() => console.log("File is opened"))
          .catch(e => console.log("Error opening file", e));
        break;
      case "document":
        this.fileOpener
          .open(locale_file, "application/pdf")
          .then(() => console.log("File is opened"))
          .catch(e => console.log("Error opening file", e));
        break;
      case "image":
        this.fileOpener
          .open(locale_file, `image/${item.format}`)
          .then(() => console.log("File is opened"))
          .catch(e => console.log("Error opening file", e));
        break;
      case "youtube":
        this.nativeHelpersService.openYoutubeApp(item.value);
        break;
      default:
    }

    // const ref = this.storage.ref("test.jpeg");
    // const uri = await ref.getDownloadURL().toPromise();

    this.fileTransfer
      .download(uri, this.file.dataDirectory + "test.jpeg")
      .then(
        entry => {
          const locale_file = entry.toURL();
          console.log("download complete: " + locale_file);
          console.log("dispatch loading false");
          this.fileOpener
            .open(locale_file, "image/jpeg")
            .then(() => {
              console.log("File is opened");
            })
            .catch(e => console.log("Error opening file", e));
        },
        error => {
          throw Error("Unable to download file.");
        }
      )
      .then(() => {
        sleeper(2000);
      })
      .then(() => {
        this.presentProcessNextActionSheet(item);
      });
  }

  public openContactCard(item) {
    // alert("Contact");
    console.log(item);
    // this.router.navigate(["/user-card/" + item.id]);
    this.presentModal(item).then((modaldata: any) => {
      if (modaldata.data.boolNavigateToMessage) {
        this.navigateTo(modaldata.data.url);
      } else {
        this.presentProcessNextActionSheet(item);
      }
    });
  }

  async presentModal(item) {
    const modal = await this.modalController.create({
      component: UserCardPage,
      componentProps: {
        item: {
          id: item.id
        }
      }
    });
    await modal.present();
    return await modal.onWillDismiss();
  }

  async presentProcessNextActionSheet(item) {
    const actionSheet = await this.actionSheetController.create({
      header: "Collection",
      backdropDismiss: false,
      buttons: [
        {
          text: "Open",
          icon: "open",
          handler: () => {
            console.log("open clicked");
            if (item.type !== "contact") {
              this.openScannedItem(item);
            } else {
              this.openContactCard(item);
            }
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
          text: item.type === "contact" ? "Add Contact" : "Add to Collection",
          icon: item.type === "contact" ? "contact" : "bookmark",
          handler: () => {
            console.log("Add to Collection clicked");
            if (item.type !== "contact") {
              this.afs.doc(`users/${this.userId}/private/inventory`).update({
                items: firebase.firestore.FieldValue.arrayUnion(item.id)
              });
              actionSheet.dismiss();
              this.router.navigateByUrl("/tabs/my-folder");
            } else {
              this.afs.firestore
                .doc(`users/${this.userId}/private/contacts`)
                .get()
                .then(docSnapshot => {
                  if (docSnapshot.exists) {
                    this.afs
                      .doc(`users/${this.userId}/private/contacts`)
                      .update({
                        users: firebase.firestore.FieldValue.arrayUnion(item.id)
                      });
                  } else {
                    this.afs.doc(`users/${this.userId}/private/contacts`).set({
                      users: firebase.firestore.FieldValue.arrayUnion(item.id)
                    });
                  }

                  this.router.navigateByUrl("/tabs/home");
                });
            }
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

    await actionSheet.present();
  }

  async presentScanAgainActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Collection",
      backdropDismiss: false,
      buttons: [
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
        }
      ]
    });

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
          this.isQRScanning = true;

          // start scanning
          const scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log("Scanned something", text);

            let scannedItem = tryParseJSON(text);

            if (scannedItem === false) {
              this.presentScanAgainActionSheet();
            } else {
              console.log(scannedItem);

              this.isQRScanning = false;

              this.presentProcessNextActionSheet(scannedItem);

              this.qrScanner.hide();
              scanSub.unsubscribe();
            }
          });

          this.qrScanner.show();
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
    this.store
      .pipe(select(fromAppReducer.selectUserId))
      .subscribe(userId => (this.userId = userId));
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
    console.log("ionViewWillLeave");
    this.qrScanner.pausePreview();
    this.qrScanner.hide();
    this.hideCamera();
  }

  ionViewDidLeave() {
    console.log("ionViewDidLeave");
  }

  navigateTo(url) {
    this.navCtrl.navigateForward("/" + url);
  }
}

import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import {
  LoadingController,
  ToastController,
  ActionSheetController,
  ModalController
} from "@ionic/angular";

import { AngularFireStorage } from "@angular/fire/storage";

import { FileOpener } from "@ionic-native/file-opener/ngx";

import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";

import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import { AngularFirestore } from "@angular/fire/firestore";
import { itemsJoin } from "../utils/utils";
import { QrCodePage } from "../qr-code/qr-code.page";

@Component({
  selector: "app-my-folder",
  templateUrl: "./my-folder.page.html",
  styleUrls: ["./my-folder.page.scss"]
})
export class MyFolderPage implements OnInit {
  filter: string;
  userId: string;
  currentDate: Date = new Date();
  yesterdayDate: Date = new Date();
  // fakeFiles$: Subject<any> = new Subject();
  isLoading: boolean = true;
  itemFiles: Array<{ name: string; type: string; url: string }> | {};
  profileUrl: Observable<string | null>;
  meta: Observable<any>;
  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(
    public loadingController: LoadingController,
    private storage: AngularFireStorage,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private file: File,
    private afs: AngularFirestore,
    private toastController: ToastController,
    private store: Store<fromAppReducer.AppState>,
    private actionSheetController: ActionSheetController,
    public modalController: ModalController,
    private socialSharing: SocialSharing
  ) {
    this.yesterdayDate.setDate(this.currentDate.getDate() - 1);
  }

  ngOnInit() {
    this.filter = "recent";
    this.store
      .pipe(select(fromAppReducer.selectUserId))
      .subscribe(userId => (this.userId = userId));

    this.store.pipe(select(fromAppReducer.selectUserId)).subscribe(userId => {
      this.userId = userId;
      this.afs.firestore
        .doc(`users/${userId}/private/inventory`)
        .get()
        .then(docSnapshot => {
          if (docSnapshot.exists) {
            // do something
            this.loadItems();
          } else {
            console.log("does not exist");
            this.isLoading = false;
            this.itemFiles = [];
          }
        });
    });
  }

  loadItems() {
    this.afs
      .doc(`users/${this.userId}/private/inventory`)
      .valueChanges()
      .pipe(itemsJoin(this.afs))
      .subscribe(files => {
        this.isLoading = false;
        this.itemFiles = files;
      });
  }

  iconType(type) {
    switch (type) {
      case "png":
      case "jpeg":
      case "jpg":
      case "gif":
        return "image";
      case "pdf":
        return "document";
      case "ppt":
      case "pptx":
        return "easel";
      default:
        return "play";
    }
  }

  async dlOpenImageFile(item) {
    const ref = this.storage.ref(`${item.name}_${item.createdAt}.${item.type}`);
    const uri = await ref.getDownloadURL().toPromise();

    this.fileTransfer
      .download(
        uri,
        this.file.dataDirectory + `${item.name}_${item.createdAt}.${item.type}`
      )
      .then(
        entry => {
          const locale_file = entry.toURL();
          console.log("download complete: " + locale_file);
          this.fileOpener
            .open(locale_file, "image/jpeg")
            .then(() => console.log("File is opened"))
            .catch(e => console.log("Error opening file", e));
        },
        error => {
          // handle error
          throw Error("Unable to download file.");
        }
      );
  }

  async dlOpenPdfFile(item) {
    const ref = this.storage.ref(`${item.name}_${item.createdAt}.${item.type}`);
    const uri = await ref.getDownloadURL().toPromise();

    this.fileTransfer
      .download(
        uri,
        this.file.dataDirectory + `${item.name}_${item.createdAt}.${item.type}`
      )
      .then(
        entry => {
          const locale_file = entry.toURL();
          console.log("download complete: " + locale_file);
          this.fileOpener
            .open(locale_file, "application/pdf")
            .then(() => console.log("File is opened"))
            .catch(e => console.log("Error opening file", e));
        },
        error => {
          // handle error
          throw Error("Unable to download file.");
        }
      );
  }

  openItem(item) {
    console.log(item);
    switch (item.type) {
      case "ppt":
      case "pptx":
        this.presentToast(true);
        this.dlOpenPptxFile(item);
        break;
      case "pdf":
        this.presentToast(true);
        this.dlOpenPdfFile(item);
        break;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        this.presentToast(true);
        this.dlOpenImageFile(item);
        break;
      default:
        this.presentToast(false);
    }
  }

  async presentToast(supported) {
    let toast;

    if (supported) {
      toast = await this.toastController.create({
        message: "Loading Content. Please wait.",
        duration: 2000
      });
    } else {
      toast = await this.toastController.create({
        header: "Error",
        message: "Fail to open the application",
        position: "bottom",
        buttons: [
          {
            text: "Close",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            }
          }
        ]
      });
    }

    toast.present();
  }

  async dlOpenPptxFile(item) {
    const ref = this.storage.ref(`${item.name}_${item.createdAt}.${item.type}`);
    const uri = await ref.getDownloadURL().toPromise();

    this.fileTransfer
      .download(
        uri,
        this.file.dataDirectory + `${item.name}_${item.createdAt}.${item.type}`
      )
      .then(
        entry => {
          const locale_file = entry.toURL();
          console.log("download complete: " + locale_file);
          this.fileOpener
            .open(
              locale_file,
              "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            )
            .then(() => console.log("File is opened"))
            .catch(e => console.log("Error opening file", e));
        },
        error => {
          // handle error
          throw Error("Unable to download file.");
        }
      );
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: QrCodePage
    });
    return await modal.present();
  }

  shareByEmail() {
    // Check if sharing via email is supported
    this.socialSharing
      .canShareViaEmail()
      .then(() => {
        // Sharing via email is possible
        // Share via email
        console.log("can share by email");
        this.socialSharing
          .shareViaEmail("Body", "Subject", ["recipient@example.org"])
          .then(() => {
            // Success!
            console.log("sucess stage");
          })
          .catch(() => {
            // Error!
            console.error("failed");
            this.presentToast(false);
          });
      })
      .catch(() => {
        // Sharing via email is not possible
        console.error("error");
        this.presentToast(false);
      });
  }

  shareByWhatsapp() {
    // Check if sharing via email is supported
    this.socialSharing
      .canShareVia("whatsapp")
      .then(() => {
        // Sharing via email is possible
        // Share via email
        console.log("can share by email");
        this.socialSharing
          .shareViaWhatsApp("Body")
          .then(() => {
            // Success!
            console.log("sucess stage");
          })
          .catch(() => {
            // Error!
            this.presentToast(false);
            console.error("failed");
          });
      })
      .catch(() => {
        // Sharing via email is not possible
        this.presentToast(false);
        console.error("error");
      });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Share Options",
      buttons: [
        {
          text: "QR Code",
          icon: "barcode",
          handler: () => {
            this.presentModal();
          }
        },
        {
          text: "Email",
          icon: "mail",
          handler: () => {
            console.log("Share clicked");
            this.shareByEmail();
          }
        },
        {
          text: "Whatsapp",
          icon: "logo-whatsapp",
          handler: () => {
            console.log("Play clicked");
            this.shareByWhatsapp();
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
}

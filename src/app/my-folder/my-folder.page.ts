import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import {
  LoadingController,
  ToastController,
  ActionSheetController,
  ModalController,
  NavController
} from "@ionic/angular";

import { AngularFireStorage } from "@angular/fire/storage";

import { FileOpener } from "@ionic-native/file-opener/ngx";
import * as firebase from "firebase";
import {
  FileTransfer,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";

import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import { AngularFirestore } from "@angular/fire/firestore";
import { itemsJoin } from "../utils/utils";
import { QrCodePage } from "../qr-code/qr-code.page";
import { NativeHelpersService } from "../shared/native-helpers.service";

@Component({
  selector: "app-my-folder",
  templateUrl: "./my-folder.page.html",
  styleUrls: ["./my-folder.page.scss"]
})
export class MyFolderPage implements OnInit {
  public filter: string;
  public userId: string;
  public currentDate: Date = new Date();
  public yesterdayDate: Date = new Date();

  public isLoading: HTMLIonLoadingElement;
  public itemFiles: Array<{ name: string; type: string; url: string }> | {};
  public profileUrl: Observable<string | null>;
  public meta: Observable<any>;
  private fileTransfer: FileTransferObject = this.transfer.create();

  constructor(
    private loadingController: LoadingController,
    private storage: AngularFireStorage,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private file: File,
    private afs: AngularFirestore,
    private nativeHelpersService: NativeHelpersService,
    private toastController: ToastController,
    private store: Store<fromAppReducer.AppState>,
    private actionSheetController: ActionSheetController,
    public modalController: ModalController,
    private socialSharing: SocialSharing,
    private navController: NavController
  ) {
    this.yesterdayDate.setDate(this.currentDate.getDate() - 1);
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.filter = "recent";

    this.presentLoading();

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
            this.isLoading.dismiss();
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
        this.isLoading.dismiss();
        console.log(files);
        this.itemFiles = files;
      });
  }

  iconType(type) {
    switch (type) {
      case "image":
        return "image";
      case "document":
        return "document";
      case "powerpoint":
        return "easel";
      default:
        return "play";
    }
  }

  async dlOpenImageFile(item) {
    let uri: any = await this.nativeHelpersService.downloadFileHelper(item);
    const locale_file = uri.toURL();

    console.log("download complete: " + locale_file);

    this.fileOpener
      .open(locale_file, `image/${item.format}`)
      .then(() => this.isLoading.dismiss())
      .catch(e => console.log("Error opening file", e));
  }

  async dlOpenPdfFile(item) {
    let uri: any = await this.nativeHelpersService.downloadFileHelper(item);
    const locale_file = uri.toURL();

    console.log("download complete: " + locale_file);

    this.fileOpener
      .open(locale_file, "application/pdf")
      .then(() => this.isLoading.dismiss())
      .catch(e => console.log("Error opening file", e));
  }

  async presentLoading() {
    this.isLoading = await this.loadingController.create({
      spinner: "circular",
      message: "Loading Content. Please wait...",
      translucent: true,
      cssClass: "loading-width extent-content"
    });
    return await this.isLoading.present();
  }

  openYoutubeApp(item) {
    this.nativeHelpersService.openYoutubeApp(item.value);
  }

  openItem(item) {
    console.log(item);
    switch (item.type) {
      case "powerpoint":
        this.presentToast(true);
        this.dlOpenPptxFile(item);
        break;
      case "document":
        this.presentToast(true);
        this.dlOpenPdfFile(item);
        break;
      case "image":
        this.presentToast(true);
        this.dlOpenImageFile(item);
        break;
      case "youtube":
        this.openYoutubeApp(item);
        break;
      default:
        this.presentToast(false);
    }
  }

  deleteItem(item) {
    this.afs.doc(`users/${this.userId}/private/inventory`).update({
      items: firebase.firestore.FieldValue.arrayRemove(item.id)
    });
  }

  async presentToast(supported) {
    let toast;

    if (supported) {
      // toast = await this.toastController.create({
      //   message: "Loading Content. Please wait.",
      //   duration: 2000
      // });
      this.presentLoading();
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
    let uri: any = await this.nativeHelpersService.downloadFileHelper(item);
    const locale_file = uri.toURL();

    console.log("download complete: " + locale_file);

    this.fileOpener
      .open(
        locale_file,
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      )
      .then(() => console.log("File is opened"))
      .catch(e => console.log("Error opening file", e));
  }

  navigatePush(page) {
    this.navController.navigateForward("/" + page);
  }

  async presentModal(item) {
    const modal = await this.modalController.create({
      component: QrCodePage,
      componentProps: { item }
    });
    return await modal.present();
  }

  async shareByEmail(item) {
    const ref = this.storage.ref(
      `${item.name}_${item.createdAt}.${item.format}`
    );
    const uri = await ref.getDownloadURL().toPromise();

    const entry = await this.fileTransfer.download(
      uri,
      this.file.dataDirectory + `${item.name}_${item.createdAt}.${item.format}`
    );

    const locale_file = entry.toURL();
    // Check if sharing via email is supported
    this.socialSharing
      .canShareViaEmail()
      .then(() => {
        // Sharing via email is possible
        // Share via email
        console.log("can share by email");
        this.socialSharing
          .shareViaEmail(
            "The items is shared via eventApp",
            "",
            [""],
            [""],
            [""],
            locale_file
          )
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

  async shareByWhatsapp(item) {
    // Check if sharing via email is supported
    if (item.type === "youtube") {
      this.socialSharing
        .canShareVia("whatsapp")
        .then(() => {
          // Sharing via email is possible
          // Share via email
          this.socialSharing
            .shareViaWhatsApp("Share by eventApp", "", item.url)
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
    } else {
      const ref = this.storage.ref(
        `${item.name}_${item.createdAt}.${item.format}`
      );
      const uri = await ref.getDownloadURL().toPromise();

      const entry = await this.fileTransfer.download(
        uri,
        this.file.dataDirectory +
          `${item.name}_${item.createdAt}.${item.format}`
      );

      const locale_file = entry.toURL();

      this.socialSharing
        .canShareVia("whatsapp")
        .then(() => {
          // Sharing via email is possible
          // Share via email
          this.socialSharing
            .shareViaWhatsApp("Share by eventApp", locale_file)
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
  }

  async presentActionSheet(item) {
    const actionSheet = await this.actionSheetController.create({
      header: "Share Options",
      buttons: [
        {
          text: "QR Code",
          icon: "barcode",
          handler: () => {
            this.presentModal(item);
          }
        },
        {
          text: "Email",
          icon: "mail",
          handler: () => {
            console.log("Share clicked");
            this.shareByEmail(item);
          }
        },
        {
          text: "Whatsapp",
          icon: "logo-whatsapp",
          handler: () => {
            console.log("Play clicked");
            this.shareByWhatsapp(item);
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

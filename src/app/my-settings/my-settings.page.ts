import { Component, OnInit } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { AuthService } from "../auth/auth.service";
import { IUser } from "../model/user.interface";
import { map } from "rxjs/operators";
import { NativeHelpersService } from "../shared/native-helpers.service";
import * as firebase from "firebase";
import { ToastController } from "@ionic/angular";
import * as fromAppReducer from "../store/app.reducer";
import { Store, select } from "@ngrx/store";
import { FcmService } from "../shared/fcm.service";

@Component({
  selector: "app-my-settings",
  templateUrl: "./my-settings.page.html",
  styleUrls: ["./my-settings.page.scss"]
})
export class MySettingsPage implements OnInit {
  private userId: string;
  private userDoc: AngularFirestoreDocument<IUser>;
  private searchUserDoc: AngularFirestoreDocument<any>;
  public userImage: string;
  public userDisplayName: string;
  public userPhoneNumber: string;
  public userEmail: string;
  public userIsSearchable: boolean = false;
  public userOccupation: string;
  public userCompanySchool: string;
  public selectedViewImage: string;
  public selectedImageFile: string;
  public attachedImage: boolean = false;
  public dateLog: number = Date.now();
  public selectedImageFileFormat: string;
  public notificationIsEnabled: boolean = false;
  public deviceToken: string = "";

  constructor(
    private store: Store<fromAppReducer.AppState>,
    private afs: AngularFirestore,
    private auth: AuthService,
    private nativeHelpersService: NativeHelpersService,
    public toastController: ToastController,
    private fcmService: FcmService
  ) {}

  ngOnInit() {
    this.store
      .pipe(select(fromAppReducer.selectDeviceToken))
      .subscribe(token => {
        console.log("device token");
        console.log(token);
        this.deviceToken = token;
      });

    this.auth.userId
      .pipe(
        map(userId => {
          this.userId = userId;
        })
      )
      .subscribe(() => {
        this.userDoc = this.afs.doc<IUser>(`users/${this.userId}`);
        this.searchUserDoc = this.afs.doc(`search/${this.userId}`);
        this.searchUserDoc
          .get()
          .toPromise()
          .then(docSnapshot => {
            if (!docSnapshot.exists) {
              this.userIsSearchable = false;
            } else {
              this.userIsSearchable = true;
            }
          });

        this.userDoc.valueChanges().subscribe(userData => {
          const {
            displayName,
            phoneNumber,
            photoUrl,
            email,
            occupation,
            company_school,
            notificationIsEnabled
          } = userData;

          this.notificationIsEnabled = notificationIsEnabled ? true : false;

          this.userImage =
            photoUrl === "" ? "assets/img/default_profile.jpg" : photoUrl;
          this.userDisplayName =
            displayName === null ||
            displayName === undefined ||
            displayName === ""
              ? ""
              : displayName;
          this.userPhoneNumber =
            phoneNumber === null ||
            phoneNumber === undefined ||
            phoneNumber === "null" ||
            phoneNumber === ""
              ? ""
              : phoneNumber.toString();
          this.userEmail =
            email === null ||
            email === undefined ||
            email === "null" ||
            email === ""
              ? ""
              : email;
          this.userCompanySchool =
            company_school === null ||
            company_school === undefined ||
            company_school === "null" ||
            company_school === ""
              ? ""
              : company_school;
          this.userOccupation =
            occupation === null ||
            occupation === undefined ||
            occupation === "null" ||
            occupation === ""
              ? ""
              : occupation;
        });
      });
  }

  updateInput(event, field) {
    switch (field) {
      case "userDisplayName": {
        this.userDisplayName = event.detail.value;
        break;
      }
      case "userPhoneNumber": {
        this.userPhoneNumber = event.detail.value;
        break;
      }
      case "userEmail": {
        this.userEmail = event.detail.value;
        break;
      }
      case "userCompanySchool": {
        this.userCompanySchool = event.detail.value;
        break;
      }
      case "userOccupation": {
        this.userOccupation = event.detail.value;
        break;
      }
      default: {
        break;
      }
    }
  }

  searchableToggle(event) {
    this.userIsSearchable = event.detail.checked;
  }

  notificationToggle(event) {
    this.notificationIsEnabled = event.detail.checked;
  }

  async uploadTask(blobInfo: { fileBlob: Blob }) {
    let _uploadFileName;

    _uploadFileName =
      this.userId + "_" + this.dateLog + "." + this.selectedImageFileFormat;

    let uploadTask = await firebase
      .storage()
      .ref()
      .child(`${_uploadFileName}`)
      .put(blobInfo.fileBlob);

    return uploadTask.ref.getDownloadURL();
  }

  async addImageFromDevice() {
    let {
      selectedImageFile,
      selectedViewImage
    } = await this.nativeHelpersService.attachImageFile();

    if (selectedImageFile !== undefined || selectedImageFile !== null) {
      this.attachedImage = true;
    }

    this.selectedViewImage = selectedViewImage;
    this.selectedImageFile = selectedImageFile;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Your user settings have been updated.",
      duration: 2000
    });
    toast.present();
  }

  async onSave() {
    if (this.attachedImage) {
      let blobInfo: {
        fileBlob: Blob;
      } = await this.nativeHelpersService.makeFileIntoBlob(
        this.selectedImageFile
      );

      let uri = await this.uploadTask(blobInfo);

      let getFilePath = this.selectedImageFile.replace(/^.*[\\\/]/, "");

      let fileExtension = getFilePath.split(".").pop();
      this.selectedImageFileFormat = fileExtension.split("?")[0];

      if (this.notificationIsEnabled) {
        this.fcmService.sub("events", this.deviceToken);
      } else {
        this.fcmService.unsub("events", this.deviceToken);
      }

      this.userDoc.update({
        photoUrl: uri,
        displayName: this.userDisplayName,
        email: this.userEmail,
        phoneNumber: this.userPhoneNumber,
        occupation: this.userOccupation,
        company_school: this.userCompanySchool,
        notificationIsEnabled: this.notificationIsEnabled
      });
    } else {
      this.userDoc
        .update({
          displayName: this.userDisplayName,
          email: this.userEmail,
          phoneNumber: this.userPhoneNumber,
          occupation: this.userOccupation,
          company_school: this.userCompanySchool,
          notificationIsEnabled: this.notificationIsEnabled
        })
        .then(() => {
          this.presentToast();
        });
    }

    if (this.userIsSearchable) {
      this.userDoc
        .valueChanges()
        .pipe(
          map(data => {
            const { displayName, photoUrl, uid } = data;
            return { displayName, photoUrl, uid };
          })
        )
        .subscribe(userData => {
          this.searchUserDoc.set(userData);
        });
    } else {
      this.searchUserDoc.delete();
    }
  }
}

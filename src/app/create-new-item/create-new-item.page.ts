import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AngularFirestore } from "@angular/fire/firestore";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as firebase from "firebase";
import { NativeHelpersService } from "../shared/native-helpers.service";
import { LoadingController, ToastController } from "@ionic/angular";
import { isYoutubeLink } from "../utils/utils";

enum FormTypeControl {
  DOCUMENT = "document",
  IMAGE = "image",
  YOUTUBE = "play"
}

enum DocumentFormatControl {
  PDF = "pdf",
  PPT = "ppt",
  PPTX = "pptx"
}

@Component({
  selector: "app-create-new-item",
  templateUrl: "./create-new-item.page.html",
  styleUrls: ["./create-new-item.page.scss"]
})
export class CreateNewItemPage implements OnInit {
  public createImageForm: FormGroup;
  public createDocumentForm: FormGroup;
  public createYoutubeLinkForm: FormGroup;
  public userId: string;
  public selectedViewImage: string;
  public selectedImageFile: string;
  public selectedImageFileFormat: string;
  public selectedDocumentFile: string;
  public selectedDocumentFileFormat: string;
  public defaultViewImage: string = "assets/img/default.jpg";
  public dateLog: number = Date.now();
  public showImageFormControl: boolean = true;
  public showDocumentFormControl: boolean = false;
  public showYoutubeFormControl: boolean = false;
  public isLoading: HTMLIonLoadingElement;

  constructor(
    public loadingController: LoadingController,
    private afs: AngularFirestore,
    private toastController: ToastController,
    private store: Store<fromAppReducer.AppState>,
    private nativeHelpersService: NativeHelpersService
  ) {}

  ngOnInit() {
    this.store
      .pipe(select(fromAppReducer.selectUserId))
      .subscribe(userId => (this.userId = userId));

    this.createImageForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      filePath: new FormControl(null, Validators.required)
    });

    this.createDocumentForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      filePath: new FormControl(null, Validators.required)
    });

    this.createYoutubeLinkForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      url: new FormControl(null, Validators.required)
    });
  }

  segmentChanged(ev: any) {
    switch (true) {
      case ev.detail.value === FormTypeControl.DOCUMENT:
        console.log("Document");
        this.showDocumentFormControl = true;
        this.showYoutubeFormControl = false;
        this.showImageFormControl = false;
        break;
      case ev.detail.value === FormTypeControl.YOUTUBE:
        console.log("Play");
        this.showYoutubeFormControl = true;
        this.showImageFormControl = false;
        this.showDocumentFormControl = false;
        break;
      case ev.detail.value === FormTypeControl.IMAGE:
        console.log("Image");
        this.showImageFormControl = true;
        this.showYoutubeFormControl = false;
        this.showDocumentFormControl = false;
        break;
      default:
        console.log("Invalid");
        break;
    }
  }

  async presentLoading() {
    this.isLoading = await this.loadingController.create({
      message: "Uploading File..."
    });
    await this.isLoading.present();
  }

  async uploadTask(blobInfo: { fileBlob: Blob }) {
    let _uploadFileName;
    let _name;
    let _type;
    let _format;
    if (this.showImageFormControl) {
      _uploadFileName =
        this.createImageForm.get("name").value +
        "_" +
        this.dateLog +
        "." +
        this.selectedImageFileFormat;

      _name = this.createImageForm.get("name").value;
      _type = "image";
      _format = this.selectedImageFileFormat;
    } else if (this.showDocumentFormControl) {
      _uploadFileName =
        this.createDocumentForm.get("name").value +
        "_" +
        this.dateLog +
        "." +
        this.selectedDocumentFileFormat;

      _name = this.createDocumentForm.get("name").value;
      _format = this.selectedDocumentFileFormat;

      if (
        this.selectedDocumentFileFormat === DocumentFormatControl.PPT ||
        this.selectedDocumentFileFormat === DocumentFormatControl.PPTX
      ) {
        _type = "powerpoint";
      } else {
        _type = "document";
      }
    } else {
      return;
    }

    let uploadTask = await firebase
      .storage()
      .ref()
      .child(`${_uploadFileName}`)
      .put(blobInfo.fileBlob);

    let uri = await uploadTask.ref.getDownloadURL();

    this.uploadForm(_format, _name, _type, uri);
  }

  async uploadForm(_format, _name, _type, _url, _value = "") {
    this.afs
      .collection("item")
      .add({
        createdAt: this.dateLog,
        format: _format,
        name: _name,
        type: _type,
        url: _url,
        value: _value
      })
      .then(doc => {
        console.log(doc.id);
        this.afs.firestore
          .doc(`users/${this.userId}/private/inventory`)
          .get()
          .then(docSnapshot => {
            if (docSnapshot.exists) {
              this.afs.doc(`users/${this.userId}/private/inventory`).update({
                items: firebase.firestore.FieldValue.arrayUnion(doc.id)
              });
            } else {
              this.afs.doc(`users/${this.userId}/private/inventory`).set({
                items: firebase.firestore.FieldValue.arrayUnion(doc.id)
              });
            }
            this.isLoading.dismiss();
          });
        this.uploadComplete();
      });
  }

  async uploadComplete() {
    let toast = await this.toastController.create({
      message: "Content Uploaded.",
      duration: 2000
    });

    toast.present();

    if (this.showDocumentFormControl) {
      this.createDocumentForm.reset();
    } else if (this.showYoutubeFormControl) {
      this.createYoutubeLinkForm.reset();
    } else {
      this.createImageForm.reset();
    }
  }

  async onImageFormSubmit() {
    this.presentLoading();
    let getFilePath = this.createImageForm.get("filePath").value;

    let fileExtension = getFilePath.split(".").pop();
    this.selectedImageFileFormat = fileExtension.split("?")[0];
    switch (true) {
      case this.selectedImageFileFormat === "jpg":
        break;
      case this.selectedImageFileFormat === "jpeg":
        break;
      case this.selectedImageFileFormat === "png":
        break;
      case this.selectedImageFileFormat === "gif":
        break;
      default:
        this.selectedImageFileFormat = "jpeg";
        break;
    }

    let blobInfo: {
      fileBlob: Blob;
    } = await this.nativeHelpersService.makeFileIntoBlob(
      this.selectedImageFile
    );

    this.uploadTask(blobInfo);
  }

  async onDocumentFormSubmit() {
    this.presentLoading();
    let getFilePath = this.createDocumentForm.get("filePath").value;
    let fileExtension = getFilePath.split(".").pop();
    this.selectedDocumentFileFormat = fileExtension.split("?")[0];

    let blobInfo: {
      fileBlob: Blob;
    } = await this.nativeHelpersService.makeFileIntoBlob(
      this.selectedDocumentFile
    );

    this.uploadTask(blobInfo);
  }

  async openCamera() {
    let {
      selectedImageFile,
      selectedViewImage
    } = await this.nativeHelpersService.openCamera();

    this.selectedViewImage = selectedViewImage;
    this.selectedImageFile = selectedImageFile;

    this.createImageForm.patchValue({
      filePath: selectedImageFile.replace(/^.*[\\\/]/, "")
    });
  }

  async attachImageFile() {
    let {
      selectedImageFile,
      selectedViewImage
    } = await this.nativeHelpersService.attachImageFile();

    this.selectedViewImage = selectedViewImage;
    this.selectedImageFile = selectedImageFile;

    this.createImageForm.patchValue({
      filePath: selectedImageFile.replace(/^.*[\\\/]/, "")
    });
  }

  async attachDocumentFile() {
    let {
      selectedDocumentFile
    } = await this.nativeHelpersService.attachDocumentFile(
      "application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf,application/vnd.ms-powerpoint"
    );

    this.selectedDocumentFile = selectedDocumentFile;
    this.createDocumentForm.patchValue({
      filePath: this.selectedDocumentFile.replace(/^.*[\\\/]/, "")
    });
  }

  async onYoutubeFormSubmit() {
    let { stat, id } = isYoutubeLink(
      this.createYoutubeLinkForm.get("url").value
    );

    const _name = this.createYoutubeLinkForm.get("name").value;
    let _url = this.createYoutubeLinkForm.get("url").value;

    if (stat) {
      this.presentLoading();
      this.uploadForm("link", _name, "youtube", _url, id);
    } else {
      let toast = await this.toastController.create({
        message: "Invalid URL Format.",
        duration: 2000
      });

      toast.present();
    }
  }
}

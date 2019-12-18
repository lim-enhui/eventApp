import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

import { AngularFirestore } from "@angular/fire/firestore";
import { Capacitor, Filesystem } from "@capacitor/core";
import { Store, select } from "@ngrx/store";
import { FileChooser } from "@ionic-native/file-chooser/ngx";
import * as fromAppReducer from "../store/app.reducer";
import * as firebase from "firebase";

enum FormTypeControl {
  DOCUMENT = "document",
  IMAGE = "image",
  YOUTUBE = "play"
}

@Component({
  selector: "app-create-new-item",
  templateUrl: "./create-new-item.page.html",
  styleUrls: ["./create-new-item.page.scss"]
})
export class CreateNewItemPage implements OnInit {
  public createImageForm: FormGroup;
  public createDocumentForm: FormGroup;
  public userId: string;
  public selectedViewImage: string;
  public selectedImageFile: string;
  public defaultViewImage: string = "assets/img/default.jpg";
  public dateLog: number = Date.now();
  public showImageFormControl: boolean = true;
  public showDocumentFormControl: boolean = false;
  public showYoutubeFormControl: boolean = false;

  constructor(
    private camera: Camera,
    private afs: AngularFirestore,
    private store: Store<fromAppReducer.AppState>,
    private fileChooser: FileChooser
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

  async onImageFormSubmit() {
    let blobInfo: any = await this.makeFileIntoBlob(this.selectedImageFile);

    let uploadTask = await firebase
      .storage()
      .ref()
      .child(`${blobInfo.fileName}`)
      .put(blobInfo.imgBlob);

    let imgSrc = await uploadTask.ref.getDownloadURL();

    this.afs
      .collection("item")
      .add({
        createdAt: this.dateLog,
        format: "jpeg",
        name: this.createImageForm.get("name").value,
        type: "image",
        url: imgSrc
      })
      .then(doc => {
        console.log(doc.id);
        this.afs.doc(`users/${this.userId}/private/inventory`).update({
          items: firebase.firestore.FieldValue.arrayUnion(doc.id)
        });
        // .set({ items: [doc.id] }, { merge: true });
      });
  }

  async onDocumentFormSubmit() {}

  async openCamera() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.selectedImageFile = await this.camera.getPicture(options);

    this.selectedViewImage = Capacitor.convertFileSrc(this.selectedImageFile);

    this.createImageForm.patchValue({
      filePath: this.selectedImageFile
    });
  }

  async attachImageFile() {
    try {
      const options: CameraOptions = {
        quality: 80,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.ALLMEDIA,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
      };

      this.selectedImageFile = await this.camera.getPicture(options);

      this.selectedViewImage = Capacitor.convertFileSrc(this.selectedImageFile);

      this.createImageForm.patchValue({
        filePath: this.selectedImageFile
      });
    } catch (e) {
      console.log(e.message);
      alert("File Upload Error " + e.message);
    }
  }

  async attachDocumentFile() {
    this.fileChooser
      .open({
        mime: "application/pdf"
      })
      .then(uri => this.readFilePath(uri))
      .catch(e => console.log(e));
  }

  async readFilePath(uri) {
    // Here's an example of reading a file with a full file path. Use this to
    // read binary data (base64 encoded) from plugins that return File URIs, such as
    // the Camera.
    console.log("uri", uri);
    try {
      let data = await Filesystem.readFile({
        path: uri
      });
      console.log(data);
    } catch (e) {
      console.error("Unable to read file", e);
    }
  }

  async stat(file) {
    try {
      let ret = await Filesystem.stat({
        path: file
      });
      console.log(ret);
    } catch (e) {
      console.error("Unable to stat file", e);
    }
  }

  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise(async (resolve, reject) => {
      let fileName = "";
      const webSafePhoto = Capacitor.convertFileSrc(_imagePath);

      const response = await fetch(webSafePhoto);

      const imgBlob = await response.blob();

      fileName =
        this.createImageForm.get("name").value + "_" + this.dateLog + ".jpeg";

      resolve({
        fileName,
        imgBlob
      });
    });
  }
}

import { Injectable } from "@angular/core";

import { Capacitor } from "@capacitor/core";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { FileChooser } from "@ionic-native/file-chooser/ngx";
import { AngularFireStorage } from "@angular/fire/storage";
import {
  FileTransfer,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { YoutubeVideoPlayer } from "@ionic-native/youtube-video-player/ngx";
import { CallNumber } from "@ionic-native/call-number/ngx";

@Injectable({
  providedIn: "root"
})
export class NativeHelpersService {
  public selectedViewImage: string;
  public selectedImageFile: string;
  public selectedImageFileFormat: string;
  public selectedDocumentFile: string;
  private fileTransfer: FileTransferObject = this.transfer.create();

  constructor(
    private camera: Camera,
    private fileChooser: FileChooser,
    private youtube: YoutubeVideoPlayer,
    private storage: AngularFireStorage,
    private transfer: FileTransfer,
    private file: File,
    private callNumber: CallNumber
  ) {}

  async callContact(contactNumber) {
    return this.callNumber.callNumber(contactNumber, true);
  }

  async openCamera(): Promise<{
    selectedImageFile?: string;
    selectedViewImage?: string;
    error?: string;
  }> {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    return new Promise(async (resolve, reject) => {
      try {
        this.selectedImageFile = await this.camera.getPicture(options);

        this.selectedViewImage = Capacitor.convertFileSrc(
          this.selectedImageFile
        );

        resolve({
          selectedImageFile: this.selectedImageFile,
          selectedViewImage: this.selectedViewImage
        });
      } catch (error) {
        reject({ error });
      }
    });
  }

  async attachDocumentFile(
    mime: string
  ): Promise<{
    selectedDocumentFile?: string;
    error?: string;
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        this.selectedDocumentFile = await this.fileChooser.open({
          mime: "*/*",
          extraMIME: mime
        });

        resolve({ selectedDocumentFile: this.selectedDocumentFile });
      } catch (error) {
        reject({ error });
      }
    });
  }

  async attachImageFile(): Promise<{
    selectedImageFile?: string;
    selectedViewImage?: string;
    error?: string;
  }> {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.ALLMEDIA,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    return new Promise(async (resolve, reject) => {
      try {
        this.selectedImageFile = await this.camera.getPicture(options);

        this.selectedViewImage = Capacitor.convertFileSrc(
          this.selectedImageFile
        );

        resolve({
          selectedImageFile: this.selectedImageFile,
          selectedViewImage: this.selectedViewImage
        });
      } catch (error) {
        reject({ error });
      }
    });
  }

  makeFileIntoBlob(_filePath): Promise<{ fileBlob: Blob }> {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise(async (resolve, reject) => {
      const webSafeFile = Capacitor.convertFileSrc(_filePath);

      const response = await fetch(webSafeFile);

      const fileBlob = await response.blob();

      resolve({
        fileBlob
      });
    });
  }

  async downloadFileHelper(item): Promise<any> {
    const ref = this.storage.ref(
      `${item.name}_${item.createdAt}.${item.format}`
    );

    const url = await ref.getDownloadURL().toPromise();

    return new Promise(async (resolve, reject) => {
      try {
        const uri: any = await this.fileTransfer.download(
          url,
          this.file.dataDirectory +
            `${item.name}_${item.createdAt}.${item.format}`
        );

        resolve(uri);
      } catch (e) {
        reject(e);
      }
    });
  }

  openYoutubeApp(value) {
    this.youtube.openVideo(value);
  }
}

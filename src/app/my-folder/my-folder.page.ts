import { Component, OnInit } from "@angular/core";
import * as faker from "faker";
import { of, Observable } from "rxjs";
import { delay } from "rxjs/operators";
import { LoadingController } from "@ionic/angular";

import { AngularFireStorage } from "@angular/fire/storage";

import { FileOpener } from "@ionic-native/file-opener/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";

@Component({
  selector: "app-my-folder",
  templateUrl: "./my-folder.page.html",
  styleUrls: ["./my-folder.page.scss"]
})
export class MyFolderPage implements OnInit {
  filter: string;
  currentDate: Date = new Date();
  yesterdayDate: Date = new Date();
  // fakeFiles$: Subject<any> = new Subject();
  isLoading: boolean = true;
  fakeFiles: Array<any> = [];
  profileUrl: Observable<string | null>;
  meta: Observable<any>;
  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(
    public loadingController: LoadingController,
    private storage: AngularFireStorage,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private file: File
  ) {
    this.yesterdayDate.setDate(this.currentDate.getDate() - 1);
  }

  ngOnInit() {
    this.filter = "recent";

    const source = of([
      {
        date: new Date().toDateString(),
        items: this.generateRandomArrayValues(4)
      },
      {
        date: new Date("2019-07-25").toDateString(),
        items: this.generateRandomArrayValues(2)
      },
      {
        date: new Date("2019-07-23").toDateString(),
        items: this.generateRandomArrayValues(4)
      },
      {
        date: new Date("2019-07-22").toDateString(),
        items: this.generateRandomArrayValues(1)
      },
      {
        date: new Date("2019-07-21").toDateString(),
        items: this.generateRandomArrayValues(4)
      }
    ]);

    source.pipe(delay(2000)).subscribe(result => {
      this.isLoading = false;
      this.fakeFiles = result;
    });
  }

  generateRandomArrayValues(num) {
    return Array(num)
      .fill(1)
      .map(_ => {
        let commonFilename = faker.system.commonFileName().split(".");
        let _filename = commonFilename[0];
        let _ext = commonFilename[1];

        return {
          name: _filename,
          type: _ext,
          imageUrl: faker.image.food()
        };
      })
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
  }

  iconType(type) {
    switch (type) {
      case "png":
      case "jpeg":
        return "image";
      case "pdf":
        return "document";
      default:
        return "play";
    }
  }

  async dlOpenImageFile() {
    const ref = this.storage.ref("test.jpeg");
    const uri = await ref.getDownloadURL().toPromise();

    this.fileTransfer.download(uri, this.file.dataDirectory + "file.jpeg").then(
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

  async dlOpenPdfFile() {
    const ref = this.storage.ref("sample.pdf");
    const uri = await ref.getDownloadURL().toPromise();

    this.fileTransfer
      .download(uri, this.file.dataDirectory + "sample.pdf")
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

  async dlOpenPptxFile() {
    const ref = this.storage.ref("sample.pptx");
    const uri = await ref.getDownloadURL().toPromise();

    this.fileTransfer
      .download(uri, this.file.dataDirectory + "sample.pptx")
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
}

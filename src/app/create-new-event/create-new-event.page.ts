import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Ionic4DatepickerModalComponent } from "@logisticinfotech/ionic4-datepicker";
import {
  ModalController,
  LoadingController,
  ToastController
} from "@ionic/angular";
import * as moment from "moment";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";

import { AngularFirestore } from "@angular/fire/firestore";

import { GeolocationService } from "../shared/geolocation.service";
import { exhaustMap, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { NativeHelpersService } from "../shared/native-helpers.service";
import * as firebase from "firebase";
import { Router } from "@angular/router";
import { sleeper } from "../utils/utils";

@Component({
  selector: "app-create-new-event",
  templateUrl: "./create-new-event.page.html",
  styleUrls: ["./create-new-event.page.scss"]
})
export class CreateNewEventPage implements OnInit {
  @ViewChild("eventinformation", { static: false }) eventinformation;

  public startDateSelected;
  public endDateSelected;
  public createEventForm: FormGroup;
  public defaultViewImage: string = "assets/img/default.jpg";
  public selectedViewImage: string;
  public selectedImageFile: string;
  public selectedImageFileFormat: string;
  public dateLog: number = Date.now();
  public userId: string;
  public isLoading: HTMLIonLoadingElement;
  public eventmode: string = "single";
  public eventlat: number;
  public eventlng: number;
  public eventtimestart: string;
  public eventtimeend: string;

  public datePickerConfig = {
    clearButton: false
  };
  public boolOptOneDayEvent: boolean = true;

  constructor(
    private store: Store<fromAppReducer.AppState>,
    private modalController: ModalController,
    private geolocationService: GeolocationService,
    private http: HttpClient,
    private toastController: ToastController,
    private afs: AngularFirestore,
    private router: Router,
    public loadingController: LoadingController,
    private nativeHelpersService: NativeHelpersService
  ) {}

  ngOnInit() {
    this.store
      .pipe(select(fromAppReducer.selectUserId))
      .subscribe(userId => (this.userId = userId));

    this.createEventForm = new FormGroup({
      eventname: new FormControl(null, Validators.required),
      eventpostal: new FormControl(null, Validators.required),
      eventaddress: new FormControl(null, Validators.required),
      eventinformation: new FormControl(null, Validators.required),
      filePath: new FormControl(null),
      eventstartdate: new FormControl(
        this.startDateSelected,
        Validators.required
      ),
      eventenddate: new FormControl(this.endDateSelected)
    });
  }

  async onSubmit() {
    this.presentLoading();
    if (this.createEventForm.get("filePath").value !== null) {
      let getFilePath = this.createEventForm.get("filePath").value;

      let fileExtension = getFilePath.split(".").pop();
      this.selectedImageFileFormat = fileExtension.split("?")[0];

      let blobInfo: {
        fileBlob: Blob;
      } = await this.nativeHelpersService.makeFileIntoBlob(
        this.selectedImageFile
      );

      this.uploadTask(blobInfo);
    } else {
      this.uploadForm();
    }
  }

  async uploadTask(blobInfo: { fileBlob: Blob }) {
    let _uploadFileName;

    _uploadFileName =
      this.createEventForm.get("eventname").value +
      "_" +
      this.dateLog +
      "." +
      this.selectedImageFileFormat;

    let uploadTask = await firebase
      .storage()
      .ref()
      .child(`${_uploadFileName}`)
      .put(blobInfo.fileBlob);

    let uri = await uploadTask.ref.getDownloadURL();

    this.uploadForm(uri);
  }

  async uploadForm(_url = null) {
    const regexEnter = /\n/g;

    this.afs
      .collection("events")
      .add({
        createdAt: this.dateLog,
        eventname: this.createEventForm.get("eventname").value,
        eventimage: _url,
        eventpostal: this.createEventForm.get("eventpostal").value,
        eventaddress: this.createEventForm.get("eventaddress").value,
        eventinformation: this.createEventForm
          .get("eventinformation")
          .value.replace(regexEnter, "<br/>"),
        eventstartdate: this.createEventForm.get("eventstartdate").value,
        eventenddate: this.createEventForm.get("eventenddate").value,
        eventisonedayevent: this.boolOptOneDayEvent,
        eventmode: this.eventmode,
        creator: this.userId,
        eventlng: this.eventlng,
        eventlat: this.eventlat,
        eventtimestart: this.eventtimestart,
        eventtimeend: this.eventtimeend
      })
      .then(doc => {
        console.log(doc.id);
        this.afs.firestore
          .doc(`users/${this.userId}/private/events`)
          .get()
          .then(docSnapshot => {
            if (docSnapshot.exists) {
              this.afs.doc(`users/${this.userId}/private/events`).update({
                createdevents: firebase.firestore.FieldValue.arrayUnion(doc.id)
              });
            } else {
              this.afs.doc(`users/${this.userId}/private/events`).set({
                createdevents: firebase.firestore.FieldValue.arrayUnion(doc.id)
              });
            }
          });
        this.uploadComplete();
      });
  }

  async uploadComplete() {
    this.isLoading.dismiss();
    let toast = await this.toastController.create({
      message: "Content Uploaded.",
      duration: 1000
    });

    toast
      .present()
      .then(() => {
        return sleeper(2000);
      })
      .then(() => {
        this.navigateTo("tabs/home");
      });

    this.createEventForm.reset();
  }

  navigateTo(page) {
    const url = "/" + page;
    this.router.navigate([url]);
  }

  timePicker(event, type) {
    let timestamp = moment(event.detail.value);

    if (type === "start") {
      this.eventtimestart = timestamp.format("hh mm A");
    } else {
      this.eventtimeend = timestamp.format("hh mm A");
    }
  }

  async presentLoading() {
    this.isLoading = await this.loadingController.create({
      message: "Uploading File..."
    });
    await this.isLoading.present();
  }

  async openCamera() {
    let {
      selectedImageFile,
      selectedViewImage
    } = await this.nativeHelpersService.openCamera();

    this.selectedViewImage = selectedViewImage;
    this.selectedImageFile = selectedImageFile;

    console.log(this.selectedViewImage);
    console.log(this.selectedImageFile);

    this.createEventForm.patchValue({
      filePath: selectedImageFile.replace(/^.*[\\\/]/, "")
    });

    console.log(this.createEventForm);
  }

  async addImageFromDevice() {
    let {
      selectedImageFile,
      selectedViewImage
    } = await this.nativeHelpersService.attachImageFile();

    this.selectedViewImage = selectedViewImage;
    this.selectedImageFile = selectedImageFile;

    this.createEventForm.patchValue({
      filePath: selectedImageFile.replace(/^.*[\\\/]/, "")
    });
  }

  selectOneDayOpt(event) {
    console.log(event.detail.checked);
    this.boolOptOneDayEvent = event.detail.checked;
  }

  async openStartDatePicker() {
    const datePickerModal = await this.modalController.create({
      component: Ionic4DatepickerModalComponent,
      cssClass: "li-ionic4-datePicker",
      componentProps: {
        objConfig: this.datePickerConfig,
        selectedDate: this.startDateSelected
      }
    });
    await datePickerModal.present();

    datePickerModal.onDidDismiss().then(data => {
      console.log(data);
      this.startDateSelected = data.data.date;
      this.createEventForm.patchValue({
        eventstartdate: this.startDateSelected
      });
    });
  }

  async openEndDatePicker() {
    const datePickerModal = await this.modalController.create({
      component: Ionic4DatepickerModalComponent,
      cssClass: "li-ionic4-datePicker",
      componentProps: {
        objConfig: this.datePickerConfig,
        selectedDate: this.endDateSelected
      }
    });
    await datePickerModal.present();

    datePickerModal.onDidDismiss().then(data => {
      console.log(data);
      this.endDateSelected = data.data.date;
      this.createEventForm.patchValue({
        eventenddate: this.endDateSelected
      });
    });
  }

  locateMe() {
    this.geolocationService
      .initGeoLocation()
      .pipe(
        exhaustMap(response => {
          this.eventlng = response.coords.longitude;
          this.eventlat = response.coords.latitude;

          return this.http.get(
            `https://maps.googleapis.com/maps/api/geocode/json?country:SG&radius=200&latlng=${response.coords.latitude},${response.coords.longitude}&key=${environment.firebaseAPIKey}`
          );
        })
      )
      .subscribe((response: any) => {
        let postalCodeRegex = /[0-9]{6}/;
        console.log(response);
        let strAddress = response.results[0].formatted_address;

        let postalAddress = postalCodeRegex.exec(strAddress)[0];

        this.createEventForm.patchValue({
          eventpostal: postalAddress,
          eventaddress: strAddress
        });
      });
  }

  selectEventMode(event) {
    this.eventmode = event.detail.value;
  }

  postalHandler(event) {
    let responseFromOneMap: any;
    if (+event.srcElement.value && event.srcElement.value.length === 6) {
      this.http
        .get(
          `https://developers.onemap.sg/commonapi/search?searchVal=${event.srcElement.value}&returnGeom=N&getAddrDetails=Y`
        )
        .pipe(
          switchMap(response => {
            responseFromOneMap = response;
            return this.http.get(
              `https://maps.googleapis.com/maps/api/geocode/json?country:SG&radius=200&address=${+event
                .srcElement.value}&key=${environment.firebaseAPIKey}`
            );
          })
        )
        .subscribe((response: any) => {
          this.eventlat = response.results[0].geometry.location.lat;
          this.eventlng = response.results[0].geometry.location.lng;

          this.createEventForm.patchValue({
            eventpostal: event.srcElement.value,
            eventaddress: responseFromOneMap.results[0].ADDRESS
          });
        });
    }
  }
}

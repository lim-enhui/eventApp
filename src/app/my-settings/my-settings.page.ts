import { Component, OnInit } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { AuthService } from "../auth/auth.service";
import { switchMap, map } from "rxjs/operators";
import { FileChooser } from "@ionic-native/file-chooser/ngx";
import { ActionSheetController } from "@ionic/angular";

export interface IUser {
  uid: string;
  displayName: string;
  photoUrl?: string;
  email: string;
  isSearchable: boolean;
  phoneNumber?: number | null | string;
}

@Component({
  selector: "app-my-settings",
  templateUrl: "./my-settings.page.html",
  styleUrls: ["./my-settings.page.scss"]
})
export class MySettingsPage implements OnInit {
  private uid;
  private userDoc: AngularFirestoreDocument<IUser>;
  private searchUserDoc: AngularFirestoreDocument<any>;
  public userImage: string;
  public userDisplayName: string;
  public userPhoneNumber: number | string;
  userIsSearchable: boolean = false;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private fileChooser: FileChooser
  ) {}

  ngOnInit() {
    this.auth.userId.subscribe(uid => {
      this.uid = uid;
      this.userDoc = this.afs.doc<IUser>(`users/${this.uid}`);
      this.searchUserDoc = this.afs.doc(`search/${this.uid}`);
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
        const { displayName, phoneNumber, photoUrl } = userData;
        this.userImage = photoUrl;
        this.userDisplayName = displayName;
        this.userPhoneNumber = phoneNumber;
      });
    });
  }

  openFileChooser() {
    this.fileChooser
      .open()
      .then(uri => console.log(uri))
      .catch(e => console.log(e));
  }

  searchableToggle(event) {
    console.log(event.detail.checked);
    console.log(this.uid);
    if (event.detail.checked) {
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

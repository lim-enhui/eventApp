import { Component, OnInit } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { AuthService } from "../auth/auth.service";
import { FileChooser } from "@ionic-native/file-chooser/ngx";
import { IUser } from "../model/user.interface";
import { map } from "rxjs/operators";

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
  public userEmail: string;
  public userIsSearchable: boolean = false;
  public userOccupation: string;
  public userCompanySchool: string;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private fileChooser: FileChooser
  ) {}

  ngOnInit() {
    this.auth.userId
      .pipe(
        map(uid => {
          this.uid = uid;
        })
      )
      .subscribe(() => {
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
          const {
            displayName,
            phoneNumber,
            photoUrl,
            email,
            occupation,
            company_school
          } = userData;
          this.userImage = photoUrl;
          this.userDisplayName = displayName;
          this.userPhoneNumber = phoneNumber;
          this.userEmail = email;
          this.userCompanySchool = company_school;
          this.userOccupation = occupation;
        });
      });
  }

  openFileChooser() {
    this.fileChooser
      .open()
      .then(uri => console.log(uri))
      .catch(e => console.log(e));
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
      default: {
        break;
      }
    }
  }

  searchableToggle(event) {
    console.log(event.detail.checked);
    console.log(this.uid);
    this.userIsSearchable = event.detail.checked;
  }

  onSave() {
    console.log("userDisplayName", this.userDisplayName);
    console.log("userPhoneNumber", this.userPhoneNumber);
    console.log("userEmail", this.userEmail);
    console.log("userIsSearchable", this.userIsSearchable);

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
    // update user
    // update search
  }
}

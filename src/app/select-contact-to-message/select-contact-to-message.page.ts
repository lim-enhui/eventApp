import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import { usersJoin } from "../utils/join.utils";
import { Router } from "@angular/router";
import * as firebase from "firebase";

@Component({
  selector: "app-select-contact-to-message",
  templateUrl: "./select-contact-to-message.page.html",
  styleUrls: ["./select-contact-to-message.page.scss"]
})
export class SelectContactToMessagePage implements OnInit {
  public contacts;
  public userId;

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private router: Router,
    private store: Store<fromAppReducer.AppState>
  ) {}

  ngOnInit() {
    this.store
      .pipe(select(fromAppReducer.selectUserId))
      .subscribe(userId => (this.userId = userId));

    this.loadContacts();
  }

  loadContacts() {
    this.afs.firestore
      .doc(`users/${this.userId}/private/contacts`)
      .get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          this.afs
            .doc(`users/${this.userId}/private/contacts`)
            .valueChanges()
            .pipe(usersJoin(this.afs))
            .subscribe((contacts: any) => {
              this.contacts = contacts.sort((a, b) => {
                if (a.displayName < b.displayName) {
                  return -1;
                }

                if (a.displayName > b.displayName) {
                  return 1;
                }

                return 0;
              });
            });
        } else {
          this.afs.doc(`users/${this.userId}/private/contacts`).set({
            users: []
          });
        }
      });
  }

  seperateLetter(record, recordIndex, records) {
    if (recordIndex == 0) {
      return record.displayName[0].toUpperCase();
    }

    let first_prev = records[recordIndex - 1].displayName[0];
    let first_current = record.displayName[0];

    if (first_prev != first_current) {
      return first_current.toUpperCase();
    }
    return null;
  }

  messageContact(uid) {
    console.log(uid);
    this.afs
      .collection(`message`)
      .add({
        chats: [],
        recipients: [uid, this.userId]
      })
      .then(doc => {
        console.log(doc);
        this.afs.firestore
          .doc(`users/${this.userId}/private/inbox`)
          .get()
          .then(docSnapshot => {
            if (docSnapshot.exists) {
              this.afs.doc(`users/${this.userId}/private/inbox`).update({
                messages: firebase.firestore.FieldValue.arrayUnion(doc.id)
              });
            } else {
              this.afs.doc(`users/${this.userId}/private/inbox`).set({
                messages: firebase.firestore.FieldValue.arrayUnion(doc.id)
              });
            }

            this.navigateTo(`message/${doc.id}`);
          });
      });
  }

  navigateTo(page) {
    const url = "/" + page;
    console.log(url);
    this.router.navigate([url]);
  }
}

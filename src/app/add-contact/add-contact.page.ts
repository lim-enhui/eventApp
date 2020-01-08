import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";

import { Subject, combineLatest } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase";

@Component({
  selector: "app-add-contact",
  templateUrl: "./add-contact.page.html",
  styleUrls: ["./add-contact.page.scss"]
})
export class AddContactPage implements OnInit {
  public contacts;
  public existingContacts: Array<string>;
  public searchInput = "";
  public searchInput$ = new Subject<string>();
  public userId: string;
  constructor(
    private store: Store<fromAppReducer.AppState>,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    this.store
      .pipe(select(fromAppReducer.selectUserId))
      .subscribe(userId => (this.userId = userId));

    this.afs.firestore
      .doc(`users/${this.userId}/private/contacts`)
      .get()
      .then(docSnapshot => {
        if (!docSnapshot.exists) {
          this.afs.doc(`users/${this.userId}/private/contacts`).set({
            users: []
          });
        } else {
          this.existingContacts = docSnapshot.get("users");
          this.afs
            .doc(`users/${this.userId}/private/contacts`)
            .valueChanges()
            .subscribe((data: any) => {
              this.existingContacts = data.users;
            });
        }
      });
    this.loadContacts();
  }

  filterInput(event) {
    if (event.detail.value.length > 3) {
      this.searchInput$.next(event.detail.value);
    }
  }

  loadContacts() {
    let fetchContacts = this.afs.collection("search").valueChanges();

    combineLatest(fetchContacts, this.searchInput$).subscribe(
      ([fetchContacts, input]) => {
        this.contacts = [
          fetchContacts.find((el: any) => {
            let input_lowercase = input.toLowerCase();
            return el.displayName.toLowerCase().includes(input_lowercase);
          })
        ];
      }
    );
  }

  addContact(contact) {
    this.afs.doc(`users/${this.userId}/private/contacts`).update({
      users: firebase.firestore.FieldValue.arrayUnion(contact.uid)
    });
  }
}

import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { IUser } from "../model/user.interface";
import { ToastController } from "@ionic/angular";
import { ModalController, NavParams } from "@ionic/angular";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as firebase from "firebase";

import {
  Contacts,
  Contact,
  ContactName,
  ContactField
} from "@ionic-native/contacts/ngx";

@Component({
  selector: "app-user-card",
  templateUrl: "./user-card.page.html",
  styleUrls: ["./user-card.page.scss"]
})
export class UserCardPage implements OnInit {
  public contactId: string = "";
  public userId: string = "";
  public user: IUser;
  public contact: IUser;
  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router,
    private contacts: Contacts,
    public toastController: ToastController,
    public modalController: ModalController,
    private navParams: NavParams,
    private store: Store<fromAppReducer.AppState>
  ) {}

  ngOnInit() {
    console.log(this.navParams);
    let item = this.navParams.get("item");
    this.contactId = item.id;

    this.store
      .pipe(select(fromAppReducer.selectUserId))
      .subscribe(userId => (this.userId = userId));

    this.afs
      .doc<IUser>(`users/${this.contactId}`)
      .valueChanges()
      .subscribe((contact: IUser) => {
        console.log(contact);
        this.contact = contact;
      });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  addContact(type) {
    if (type === "native") {
      let contact: Contact = this.contacts.create();

      contact.name = new ContactName(null, null, this.contact.displayName);
      contact.phoneNumbers = [
        new ContactField("mobile", this.contact.phoneNumber.toString())
      ];
      if (this.contact.email !== null) {
        contact.emails = [new ContactField("email", this.contact.email)];
      }

      // contact.birthday = new Date();
      contact.save().then(
        () => this.presentToast("Contact has been saved to device Phonebook!"),
        (error: any) => console.error("Error saving contact.", error)
      );
    } else if (type === "app") {
      this.afs
        .doc(`users/${this.userId}/private/contacts`)
        .update({
          users: firebase.firestore.FieldValue.arrayUnion(this.contactId)
        })
        .then(() => {
          this.presentToast("Contact has been added to Contact List!");
        });
    }
  }

  textContact() {
    this.afs
      .collection(`message`)
      .add({
        chats: [],
        recipients: [this.contactId, this.userId]
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
    const url = page;
    console.log(url);
    // this.router.navigate([url]);
    this.dismiss(true, url);
  }

  dismiss(boolNavigateToMessage: boolean = false, url: string = "") {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
      boolNavigateToMessage,
      url
    });
  }
}

import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { IUser } from "../model/user.interface";
import { ToastController } from "@ionic/angular";

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
  public userId: string = "";
  public user: IUser;
  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private contacts: Contacts,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          console.log(params);
          this.userId = params.get("id");

          return this.afs.doc<IUser>(`users/${this.userId}`).valueChanges();
        })
      )
      .subscribe((user: IUser) => {
        console.log(user);
        this.user = user;
      });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Contact has been saved to device Phonebook!",
      duration: 2000
    });
    toast.present();
  }

  addContact(type) {
    if (type === "native") {
      let contact: Contact = this.contacts.create();

      contact.name = new ContactName(null, null, this.user.displayName);
      contact.phoneNumbers = [
        new ContactField("mobile", this.user.phoneNumber.toString())
      ];
      if (this.user.email !== null) {
        contact.emails = [new ContactField("email", this.user.email)];
      }

      // contact.birthday = new Date();
      contact.save().then(
        () => this.presentToast(),
        (error: any) => console.error("Error saving contact.", error)
      );
    }
  }
}

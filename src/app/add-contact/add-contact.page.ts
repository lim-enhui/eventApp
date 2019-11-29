import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Subject, combineLatest } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-add-contact",
  templateUrl: "./add-contact.page.html",
  styleUrls: ["./add-contact.page.scss"]
})
export class AddContactPage implements OnInit {
  public contacts;
  public searchInput = "";
  public searchInput$ = new Subject();

  constructor(private http: HttpClient, private afs: AngularFirestore) {}

  ngOnInit() {
    this.loadContacts();
  }

  filterInput(event) {
    if (event.detail.value.length > 3) {
      this.searchInput$.next(event.detail.value);
    }
  }

  loadContacts() {
    let fetchContacts = this.afs.collection("search").valueChanges();

    combineLatest(fetchContacts, this.searchInput$).subscribe(data => {
      this.contacts = [
        data[0].find((el: any) => {
          return el.displayName.toLowerCase().includes(data[1]);
        })
      ];
      console.log(this.contacts);
    });
  }

  addContact(contact) {
    console.log(contact);
    // this.afs.doc(`/users/${}`)
    //  set request on pending...
  }
}

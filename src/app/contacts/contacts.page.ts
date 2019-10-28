import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { Router } from "@angular/router";
@Component({
  selector: "app-contacts",
  templateUrl: "./contacts.page.html",
  styleUrls: ["./contacts.page.scss"]
})
export class ContactsPage implements OnInit {
  contacts;

  constructor(
    private http: HttpClient,
    private callNumber: CallNumber,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.http.get("https://randomuser.me/api/?results=50").subscribe(res => {
      this.contacts = res["results"].sort((a, b) => {
        if (a.name.last < b.name.last) {
          return -1;
        }

        if (a.name.last > b.name.last) {
          return 1;
        }

        return 0;
      });
      console.log(this.contacts);
    });
  }

  seperateLetter(record, recordIndex, records) {
    if (recordIndex == 0) {
      return record.name.last[0].toUpperCase();
    }

    let first_prev = records[recordIndex - 1].name.last[0];
    let first_current = record.name.last[0];

    if (first_prev != first_current) {
      return first_current.toUpperCase();
    }
    return null;
  }

  callContact(contactNumber) {
    this.callNumber
      .callNumber(contactNumber, true)
      .then(res => console.log("Launched dialer!", res))
      .catch(err => console.log("Error launching dialer", err));
  }

  navigateTo(page) {
    const url = "/" + page;
    console.log(url);
    this.router.navigate([url]);
  }
}

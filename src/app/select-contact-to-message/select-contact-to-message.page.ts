import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-select-contact-to-message",
  templateUrl: "./select-contact-to-message.page.html",
  styleUrls: ["./select-contact-to-message.page.scss"]
})
export class SelectContactToMessagePage implements OnInit {
  public contacts;

  constructor(private http: HttpClient) {}

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

  messageContact(uid) {
    console.log(uid);
  }
}

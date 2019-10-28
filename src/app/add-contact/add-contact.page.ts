import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Subject, combineLatest } from "rxjs";

@Component({
  selector: "app-add-contact",
  templateUrl: "./add-contact.page.html",
  styleUrls: ["./add-contact.page.scss"]
})
export class AddContactPage implements OnInit {
  public contacts;
  public searchInput = "";
  public searchInput$ = new Subject();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadContacts();
  }

  filterInput(event) {
    this.searchInput$.next(event.detail.value);
  }

  loadContacts() {
    let fetchContacts = this.http.get("https://randomuser.me/api/?results=50");
    combineLatest(fetchContacts, this.searchInput$).subscribe(data => {
      this.contacts = data[0]["results"].filter(el => {
        return (
          el.name.first.toLowerCase().includes(data[1]) ||
          el.name.last.toLowerCase().includes(data[1]) ||
          el.login.username.toLowerCase().includes(data[1])
        );
      });
    });
  }
}

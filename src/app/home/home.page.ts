import { Component, OnInit } from "@angular/core";
import { MenuController, NavController } from "@ionic/angular";

import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  private status: number;
  public distance: number = 5;
  public eventDateTimePreference: string = "All";

  constructor(
    public menuController: MenuController,
    private geolocation: Geolocation,
    private router: Router,
    private navController: NavController
  ) {}

  ngOnInit() {
    console.log("ngOnInit Home");

    this.status = 1;

    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        // resp.coords.latitude
        // resp.coords.longitude
        console.log("ngOnInit Gelocation");
        console.log(resp.coords.latitude);
        console.log(resp.coords.longitude);
      })
      .catch(error => {
        console.log("Error getting location", error);
      });
  }

  onDistanceChange(event) {
    console.log(event);
  }
  toggleRightMenu() {
    this.menuController.toggle("end");
  }

  radioGroupChange(event) {
    console.log("radioGroupChange", event.detail);
  }

  radioSelect(event) {
    console.log("radioSelect", event.detail);
  }

  navigateTo(page) {
    const url = "/" + page;
    this.router.navigate([url]);
  }

  navigatePush(page) {
    this.navController.navigateForward("/" + page);
  }
}

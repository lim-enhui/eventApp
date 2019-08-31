import { Component, OnInit } from "@angular/core";
import { MenuController, NavController } from "@ionic/angular";

import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import { Observable } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  public distance: number = 5;
  public eventDateTimePreference: string = "All";

  public latitude: number;
  public longitude: number;
  public geolocation$: Observable<any>;

  constructor(
    public menuController: MenuController,
    private router: Router,
    private store: Store<any>,
    private navController: NavController
  ) {}

  ngOnInit() {
    console.log("ngOnInit Home");
    this.geolocation$ = this.store.pipe(
      select(fromAppReducer.selectGeolocation)
    );
    this.geolocation$.subscribe(console.log);
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

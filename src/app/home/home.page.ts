import { Component, OnInit } from "@angular/core";
import { MenuController, NavController } from "@ionic/angular";

import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as fromAppActions from "../store/app.actions";
import { Observable, of } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { IEvent } from "../model/event.interface";
import { map, switchMap } from "rxjs/operators";
import { distanceInKmBetweenEarthCoordinates } from "../utils/utils";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  public distance: number = 3;
  public eventDateTimePreference: string = "All";

  public latitude: number;
  public longitude: number;
  public geolocation$: Observable<{ latitude: number; longitude: number }>;
  public events$: Observable<IEvent[]>;
  public events: IEvent[];
  public allEvents: IEvent[];
  public defaultImage: string = "assets/img/default.jpg";

  constructor(
    public menuController: MenuController,
    private router: Router,
    private store: Store<fromAppReducer.AppState>,
    private navController: NavController,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    console.log("ngOnInit [Home Page]");

    this.store
      .pipe(select(fromAppReducer.selectGeolocation))
      .pipe(
        switchMap((geolocation: { latitude: number; longitude: number }) => {
          return this.store.pipe(select(fromAppReducer.selectEvents)).pipe(
            map((events: IEvent[]) => {
              let _events = events.map(element => {
                let { eventlat, eventlng } = element;
                let distance = distanceInKmBetweenEarthCoordinates(
                  eventlat,
                  eventlng,
                  geolocation.latitude,
                  geolocation.longitude
                );
                return { ...element, distance };
              });
              return _events;
            })
          );
        })
      )
      .subscribe((events: IEvent[]) => {
        console.log(events);
        this.allEvents = events.filter(element => {
          return Date.parse(element.eventstartdate) >= Date.now();
        });

        this.events = events.filter(element => {
          return (
            +element.distance < +this.distance &&
            Date.parse(element.eventstartdate) >= Date.now()
          );
        });
      });

    // this.events$ = this.store.pipe(select(fromAppReducer.selectEvents));

    // .subscribe((geolocation: { latitude: number; longitude: number }) => {
    //   this.latitude = geolocation.latitude;
    //   this.longitude = geolocation.longitude;
    //   console.log(this.latitude);
    //   console.log(this.longitude);
    // });
  }

  updateEvents() {
    console.log("update Events");

    this.allEvents.map((element: IEvent) => {
      let { eventlat, eventlng } = element;
      let distance = distanceInKmBetweenEarthCoordinates(
        eventlat,
        eventlng,
        this.latitude,
        this.longitude
      );
      return { ...element, distance };
    });

    this.events = this.allEvents.filter(element => {
      return (
        +element.distance < +this.distance &&
        Date.parse(element.eventstartdate) >= Date.now()
      );
    });
  }

  ionViewWillEnter() {}

  truncateString(str, num) {
    // If the length of str is less than or equal to num
    // just return str--don't truncate it.
    if (str.length <= num) {
      return str;
    }
    // Return str truncated with '...' concatenated to the end of str.
    return str.slice(0, num) + "...";
  }

  onDistanceChange(event) {
    console.log(event.detail.value);
    this.events = this.allEvents.filter(
      element => element.distance < +event.detail.value
    );
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

  navigatePush(page) {
    this.navController.navigateForward("/" + page);
  }

  navigateTo(page) {
    const url = "/" + page;
    console.log(url);
    this.router.navigate([url]);
  }
}

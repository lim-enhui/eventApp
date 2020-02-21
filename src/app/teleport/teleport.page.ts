import { Component, OnInit } from "@angular/core";

import { Store, select } from "@ngrx/store";
import * as fromAppReducer from "../store/app.reducer";
import * as fromAppActions from "../store/app.actions";
import { Observable } from "rxjs";
import { IGeoLocation } from "../store/geolocation.model";

@Component({
  selector: "app-teleport",
  templateUrl: "./teleport.page.html",
  styleUrls: ["./teleport.page.scss"]
})
export class TeleportPage implements OnInit {
  latitude: number;
  longitude: number;
  zoom: number = 18;

  public geolocation$: Observable<IGeoLocation>;

  constructor(private store: Store<fromAppReducer.AppState>) {}

  ngOnInit() {
    this.geolocation$ = this.store.pipe(
      select(fromAppReducer.selectGeolocation)
    );
    this.geolocation$.subscribe(coords => {
      this.latitude = coords.latitude;
      this.longitude = coords.longitude;
      console.log(coords);
    });
  }

  onChoseLocation(event) {
    this.store.dispatch(
      fromAppActions.updateGeoLocation({
        latitude: event.coords.lat,
        longitude: event.coords.lng
      })
    );
  }
}

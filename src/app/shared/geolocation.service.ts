import { Injectable } from "@angular/core";
import { BehaviorSubject, from } from "rxjs";
import { Geolocation } from "@ionic-native/geolocation/ngx";

export interface IGeoLocation {
  longitude: number;
  latitude: number;
}

@Injectable({
  providedIn: "root"
})
export class GeolocationService {
  private geoLocation: IGeoLocation = {
    longitude: null,
    latitude: null
  };

  private geoLocation$ = new BehaviorSubject<IGeoLocation>(this.geoLocation);

  constructor(private geolocation: Geolocation) {}

  initGeoLocation() {
    return from(this.geolocation.getCurrentPosition());
  }

  getLocation$() {
    return this.geoLocation$.asObservable();
  }

  postLocation(location: IGeoLocation) {
    this.geoLocation$.next(location);
  }
}

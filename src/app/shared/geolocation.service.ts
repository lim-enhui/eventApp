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
    // .then(resp => {
    //   console.log("ngOnInit Gelocation Service");
    //   console.log(resp.coords.latitude);
    //   console.log(resp.coords.longitude);
    //   this.geoLocation$.next({
    //     longitude: resp.coords.longitude,
    //     latitude: resp.coords.latitude
    //   });
    // })
    // .catch(error => {
    //   console.log("Error getting location", error);
    // });
  }

  getLocation$() {
    return this.geoLocation$.asObservable();
  }

  postLocation(location: IGeoLocation) {
    this.geoLocation$.next(location);
  }
}

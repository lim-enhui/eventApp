import { Injectable } from "@angular/core";

import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";

import { GeolocationService } from "../shared/geolocation.service";
import * as fromAppActions from "./app.actions";
import { IGeoLocation } from "./geolocation.model";
import { Observable } from "rxjs";
import { map, mergeMap, catchError } from "rxjs/operators";

@Injectable()
export class AppEffect {
  constructor(
    private actions$: Actions,
    private geolocationService: GeolocationService
  ) {}

  loadGeolocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAppActions.loadGeoLocation),
      mergeMap(() =>
        this.geolocationService
          .initGeoLocation()
          .pipe(
            map(response =>
              fromAppActions.loadGeoLocationSuccess({
                latitude: response.coords.latitude,
                longitude: response.coords.longitude
              })
            )
          )
      )
    )
  );
}

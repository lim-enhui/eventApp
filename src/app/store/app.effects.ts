import { Injectable } from "@angular/core";

import { Actions, createEffect, ofType } from "@ngrx/effects";

import { GeolocationService } from "../shared/geolocation.service";
import * as fromAppActions from "./app.actions";

import { map, mergeMap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { IEvent } from "../model/event.interface";

@Injectable()
export class AppEffect {
  constructor(
    private actions$: Actions,
    private geolocationService: GeolocationService,
    private afs: AngularFirestore
  ) {}

  loadGeolocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAppActions.loadGeoLocation),
      mergeMap(() =>
        this.geolocationService.initGeoLocation().pipe(
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

  loadEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAppActions.loadEvents),
      mergeMap(() =>
        this.afs
          .collection("events")
          .valueChanges()
          .pipe(
            map((events: IEvent[]) =>
              fromAppActions.loadEventsSuccess({
                events
              })
            )
          )
      )
    )
  );
}

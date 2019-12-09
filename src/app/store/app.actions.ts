import { createAction, props } from "@ngrx/store";

export const loadGeoLocation = createAction("[App Page] Load GeoLocation");

export const loadGeoLocationSuccess = createAction(
  "[App Page] Load GeoLocation Success",
  props<{ latitude: number; longitude: number }>()
);

export const updateGeoLocation = createAction(
  "[Teleport Page] Update GeoLocation",
  props<{ latitude: number; longitude: number }>()
);

export const updateUserId = createAction(
  "[Auth Page] Update UserId",
  props<{ userId: string }>()
);

export const updateScanning = createAction(
  "[QrScanner Page] Update Scanning State",
  props<{ isScanning: boolean }>()
);

export const updateQRLoading = createAction(
  "[QRScanner Page] Update Loading State",
  props<{ loading: boolean }>()
);

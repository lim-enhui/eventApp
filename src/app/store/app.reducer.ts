import * as fromRoot from "./app.actions";
import { createReducer, on, createSelector, State } from "@ngrx/store";
import { IGeoLocation } from "./geolocation.model";

export interface AppState {
  geolocation: IGeoLocation;
  loading: boolean;
  userId: string;
  isScanning: boolean;
}

const initialState: AppState = {
  geolocation: {
    latitude: null,
    longitude: null
  },
  loading: false,
  userId: "",
  isScanning: false
};

export const appReducer = createReducer(
  initialState,
  on(fromRoot.loadGeoLocationSuccess, (state, payload) => {
    return {
      ...state,
      geolocation: {
        latitude: payload.latitude,
        longitude: payload.longitude
      }
    };
  }),
  on(fromRoot.updateGeoLocation, (state, payload) => {
    return {
      ...state,
      geolocation: {
        latitude: payload.latitude,
        longitude: payload.longitude
      }
    };
  }),
  on(fromRoot.updateUserId, (state, payload) => {
    return {
      ...state,
      userId: payload.userId
    };
  }),
  on(fromRoot.updateScanning, (state, payload) => {
    return {
      ...state,
      isScanning: payload.isScanning
    };
  }),
  on(fromRoot.updateQRLoading, (state, payload) => {
    return {
      ...state,
      loading: payload.loading
    };
  })
);

export const selectApp = state => state.app;

export const selectUserId = createSelector(
  selectApp,
  (state: AppState) => state.userId
);

export const selectGeolocation = createSelector(
  selectApp,
  (state: AppState) => state.geolocation
);

export const selectIsScanning = createSelector(
  selectApp,
  (state: AppState) => state.isScanning
);

export const selectLoading = createSelector(
  selectApp,
  (state: AppState) => state.loading
);

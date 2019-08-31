import * as fromRoot from "./app.actions";
import { createReducer, on, createSelector } from "@ngrx/store";

export interface AppState {
  geolocation: {
    latitude: number | null;
    longitude: number | null;
  };
  loading: boolean;
  loaded: boolean;
}

const initialState: AppState = {
  geolocation: {
    latitude: null,
    longitude: null
  },
  loading: false,
  loaded: true
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
  })
);

export const selectApp = state => state.app;

export const selectGeolocation = createSelector(
  selectApp,
  (state: AppState) => state.geolocation
);

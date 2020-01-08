import * as fromRoot from "./app.actions";
import { createReducer, on, createSelector, State } from "@ngrx/store";
import { IGeoLocation } from "./geolocation.model";
import { IEvent } from "../model/event.interface";
import { IMessage } from "../model/message.interface";

export interface AppState {
  geolocation: IGeoLocation;
  userId: string;
  events: IEvent[];
  messages: IMessage[];
}

const initialState: AppState = {
  geolocation: {
    latitude: null,
    longitude: null
  },
  userId: "",
  events: [],
  messages: []
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
  on(fromRoot.loadEventsSuccess, (state, payload) => {
    return {
      ...state,
      events: payload.events
    };
  }),
  on(fromRoot.loadMessagesSuccess, (state, payload) => {
    return {
      ...state,
      messages: payload.messages
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
  })
);

export const selectApp = state => state.app;

export const selectUserId = createSelector(
  selectApp,
  (state: AppState) => state.userId
);

export const selectEvents = createSelector(
  selectApp,
  (state: AppState) => state.events
);

export const selectMessages = createSelector(
  selectApp,
  (state: AppState) => state.messages
);

export const selectGeolocation = createSelector(
  selectApp,
  (state: AppState) => state.geolocation
);

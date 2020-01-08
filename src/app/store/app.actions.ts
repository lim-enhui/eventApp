import { createAction, props } from "@ngrx/store";
import { IEvent } from "../model/event.interface";
import { IMessage } from "../model/message.interface";

export const loadGeoLocation = createAction("[App Page] Load GeoLocation");

export const loadEvents = createAction("[Home Page] Load Events");

export const loadMessages = createAction("[Messages Page] Load Messages");

export const loadGeoLocationSuccess = createAction(
  "[App Page] Load GeoLocation Success",
  props<{ latitude: number; longitude: number }>()
);

export const loadEventsSuccess = createAction(
  "[Home Page] Load Events Success",
  props<{ events: IEvent[] }>()
);

export const loadMessagesSuccess = createAction(
  "[Messages Page] Load Messages Success",
  props<{ messages: IMessage[] }>()
);

export const updateGeoLocation = createAction(
  "[Teleport Page] Update GeoLocation",
  props<{ latitude: number; longitude: number }>()
);

export const updateEvents = createAction(
  "[Home Page] Load Events Success",
  props<{ events: IEvent[] }>()
);

export const updateUserId = createAction(
  "[Auth Page] Update UserId",
  props<{ userId: string }>()
);

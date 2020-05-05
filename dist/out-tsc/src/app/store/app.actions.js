import { createAction, props } from "@ngrx/store";
export var loadGeoLocation = createAction("[App Page] Load GeoLocation");
export var loadEvents = createAction("[Home Page] Load Events");
export var loadMessages = createAction("[Messages Page] Load Messages");
export var loadGeoLocationSuccess = createAction("[App Page] Load GeoLocation Success", props());
export var loadEventsSuccess = createAction("[Home Page] Load Events Success", props());
export var loadMessagesSuccess = createAction("[Messages Page] Load Messages Success", props());
export var updateGeoLocation = createAction("[Teleport Page] Update GeoLocation", props());
export var updateEvents = createAction("[Home Page] Load Events Success", props());
export var loadDeviceToken = createAction("[App Component] Load Device Token", props());
export var updateUserId = createAction("[Auth Page] Update UserId", props());
//# sourceMappingURL=app.actions.js.map
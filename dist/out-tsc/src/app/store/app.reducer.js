import * as tslib_1 from "tslib";
import * as fromRoot from "./app.actions";
import { createReducer, on, createSelector } from "@ngrx/store";
var initialState = {
    geolocation: {
        latitude: null,
        longitude: null
    },
    userId: "",
    events: [],
    messages: [],
    deviceToken: ""
};
export var appReducer = createReducer(initialState, on(fromRoot.loadGeoLocationSuccess, function (state, payload) {
    return tslib_1.__assign({}, state, { geolocation: {
            latitude: payload.latitude,
            longitude: payload.longitude
        } });
}), on(fromRoot.loadEventsSuccess, function (state, payload) {
    return tslib_1.__assign({}, state, { events: payload.events });
}), on(fromRoot.loadMessagesSuccess, function (state, payload) {
    return tslib_1.__assign({}, state, { messages: payload.messages });
}), on(fromRoot.loadDeviceToken, function (state, payload) {
    return tslib_1.__assign({}, state, { deviceToken: payload.token });
}), on(fromRoot.updateGeoLocation, function (state, payload) {
    return tslib_1.__assign({}, state, { geolocation: {
            latitude: payload.latitude,
            longitude: payload.longitude
        } });
}), on(fromRoot.updateUserId, function (state, payload) {
    return tslib_1.__assign({}, state, { userId: payload.userId });
}));
export var selectApp = function (state) { return state.app; };
export var selectUserId = createSelector(selectApp, function (state) { return state.userId; });
export var selectEvents = createSelector(selectApp, function (state) { return state.events; });
export var selectDeviceToken = createSelector(selectApp, function (state) { return state.deviceToken; });
export var selectMessages = createSelector(selectApp, function (state) { return state.messages; });
export var selectGeolocation = createSelector(selectApp, function (state) { return state.geolocation; });
//# sourceMappingURL=app.reducer.js.map
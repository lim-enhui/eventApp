import * as tslib_1 from "tslib";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { EventRegistrationPage } from "./event-registration.page";
import { AgmCoreModule } from "@agm/core";
var routes = [
    {
        path: "",
        component: EventRegistrationPage
    }
];
var EventRegistrationPageModule = /** @class */ (function () {
    function EventRegistrationPageModule() {
    }
    EventRegistrationPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                AgmCoreModule.forRoot({
                    apiKey: "AIzaSyC8ARJENkIiYflB87N6i3saTjJuaPdKvTQ"
                }),
                RouterModule.forChild(routes)
            ],
            declarations: [EventRegistrationPage]
        })
    ], EventRegistrationPageModule);
    return EventRegistrationPageModule;
}());
export { EventRegistrationPageModule };
//# sourceMappingURL=event-registration.module.js.map
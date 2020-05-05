import * as tslib_1 from "tslib";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { CreateNewEventPage } from "./create-new-event.page";
import { Ionic4DatepickerModule } from "@logisticinfotech/ionic4-datepicker";
var routes = [
    {
        path: "",
        component: CreateNewEventPage
    }
];
var CreateNewEventPageModule = /** @class */ (function () {
    function CreateNewEventPageModule() {
    }
    CreateNewEventPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                IonicModule,
                Ionic4DatepickerModule,
                RouterModule.forChild(routes)
            ],
            declarations: [CreateNewEventPage]
        })
    ], CreateNewEventPageModule);
    return CreateNewEventPageModule;
}());
export { CreateNewEventPageModule };
//# sourceMappingURL=create-new-event.module.js.map
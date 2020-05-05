import * as tslib_1 from "tslib";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { UserPage } from "./user.page";
var routes = [
    {
        path: "",
        component: UserPage
    }
];
var UserPageModule = /** @class */ (function () {
    function UserPageModule() {
    }
    UserPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            entryComponents: [],
            declarations: [UserPage]
        })
    ], UserPageModule);
    return UserPageModule;
}());
export { UserPageModule };
//# sourceMappingURL=user.module.js.map
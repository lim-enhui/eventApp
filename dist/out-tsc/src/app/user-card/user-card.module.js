import * as tslib_1 from "tslib";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { UserCardPage } from "./user-card.page";
var routes = [
    {
        path: ":id",
        component: UserCardPage
    }
];
var UserCardPageModule = /** @class */ (function () {
    function UserCardPageModule() {
    }
    UserCardPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [UserCardPage]
        })
    ], UserCardPageModule);
    return UserCardPageModule;
}());
export { UserCardPageModule };
//# sourceMappingURL=user-card.module.js.map
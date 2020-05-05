import * as tslib_1 from "tslib";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { CreateNewItemPage } from "./create-new-item.page";
import { NativeHelpersService } from "../shared/native-helpers.service";
var routes = [
    {
        path: "",
        component: CreateNewItemPage
    }
];
var CreateNewItemPageModule = /** @class */ (function () {
    function CreateNewItemPageModule() {
    }
    CreateNewItemPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [CreateNewItemPage],
            providers: [NativeHelpersService]
        })
    ], CreateNewItemPageModule);
    return CreateNewItemPageModule;
}());
export { CreateNewItemPageModule };
//# sourceMappingURL=create-new-item.module.js.map
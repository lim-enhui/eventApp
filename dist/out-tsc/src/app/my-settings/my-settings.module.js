import * as tslib_1 from "tslib";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FileChooser } from "@ionic-native/file-chooser/ngx";
import { IonicModule } from "@ionic/angular";
import { MySettingsPage } from "./my-settings.page";
var routes = [
    {
        path: "",
        component: MySettingsPage
    }
];
var MySettingsPageModule = /** @class */ (function () {
    function MySettingsPageModule() {
    }
    MySettingsPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            providers: [FileChooser],
            declarations: [MySettingsPage]
        })
    ], MySettingsPageModule);
    return MySettingsPageModule;
}());
export { MySettingsPageModule };
//# sourceMappingURL=my-settings.module.js.map
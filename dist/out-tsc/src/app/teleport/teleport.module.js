import * as tslib_1 from "tslib";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AgmCoreModule } from "@agm/core";
import { IonicModule } from "@ionic/angular";
import { TeleportPage } from "./teleport.page";
import { GeolocationService } from "../shared/geolocation.service";
var routes = [
    {
        path: "",
        component: TeleportPage
    }
];
var TeleportPageModule = /** @class */ (function () {
    function TeleportPageModule() {
    }
    TeleportPageModule = tslib_1.__decorate([
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
            providers: [GeolocationService],
            declarations: [TeleportPage]
        })
    ], TeleportPageModule);
    return TeleportPageModule;
}());
export { TeleportPageModule };
//# sourceMappingURL=teleport.module.js.map
import * as tslib_1 from "tslib";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { AuthGuard } from "../auth/auth.guard";
import { TabsPage } from "./tabs.page";
var routes = [
    {
        path: "tabs",
        component: TabsPage,
        children: [
            {
                path: "contacts",
                children: [
                    {
                        path: "",
                        loadChildren: "../contacts/contacts.module#ContactsPageModule",
                        canLoad: [AuthGuard]
                    }
                ]
            },
            {
                path: "home",
                children: [
                    {
                        path: "",
                        loadChildren: "../home/home.module#HomePageModule",
                        canLoad: [AuthGuard]
                    }
                ]
            },
            {
                path: "qr-scanner",
                children: [
                    {
                        path: "",
                        loadChildren: "../qr-scanner/qr-scanner.module#QrScannerPageModule",
                        canLoad: [AuthGuard]
                    }
                ]
            },
            {
                path: "my-folder",
                children: [
                    {
                        path: "",
                        loadChildren: "../my-folder/my-folder.module#MyFolderPageModule",
                        canLoad: [AuthGuard]
                    }
                ]
            },
            {
                path: "user",
                children: [
                    {
                        path: "",
                        loadChildren: "../user/user.module#UserPageModule",
                        canLoad: [AuthGuard]
                    }
                ]
            },
            {
                path: "messages",
                children: [
                    {
                        path: "",
                        loadChildren: "../messages/messages.module#MessagesPageModule",
                        canLoad: [AuthGuard]
                    }
                ]
            },
            {
                path: "event-registration",
                children: [
                    {
                        path: "",
                        loadChildren: "../event-registration/event-registration.module#EventRegistrationPageModule",
                        canLoad: [AuthGuard]
                    }
                ]
            },
            {
                path: "",
                redirectTo: "/tabs/home",
                pathMatch: "full",
                canLoad: [AuthGuard]
            }
        ]
    },
    {
        path: "",
        redirectTo: "/tabs/home",
        pathMatch: "full",
        canLoad: [AuthGuard]
    }
];
var TabsPageModule = /** @class */ (function () {
    function TabsPageModule() {
    }
    TabsPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [TabsPage]
        })
    ], TabsPageModule);
    return TabsPageModule;
}());
export { TabsPageModule };
//# sourceMappingURL=tabs.module.js.map
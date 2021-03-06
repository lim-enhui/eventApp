import { Component } from "@angular/core";
import { Observable } from "rxjs";

import { Platform } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"]
})
export class AuthPage {
  public user: Observable<firebase.User>;
  public isLogin: boolean = true;
  public isLoading: boolean = false;

  constructor(
    private platform: Platform,
    private router: Router,
    private authService: AuthService
  ) {}

  authenticate(email: string, password: string) {
    let authObs: Observable<object>;

    if (this.isLogin) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      () => {
        this.router.navigateByUrl("/tabs/home");
      },
      err => {
        console.log(err);
      }
    );
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
    form.reset();
  }

  onSwitchAuthMode(form: NgForm) {
    form.reset();
    this.isLogin = !this.isLogin;
  }

  googleLogin() {
    if (this.platform.is("cordova")) {
      this.authService.nativeGoogleLogin().then(res => {
        console.log(res);
        this.authService.setUserData(res, "google");
        this.router.navigateByUrl("/tabs/home");
      });
    }
  }

  facebookLogin() {
    if (this.platform.is("cordova")) {
      this.authService.nativeFacebookLogin().then(res => {
        console.log(res);
        this.authService.setUserData(res, "facebook");
        this.router.navigateByUrl("/tabs/home");
      });
    }
  }
}

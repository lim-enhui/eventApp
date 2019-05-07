import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Platform } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';



@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})

export class AuthPage implements OnInit {

  user: Observable<firebase.User>;
  isLogin = true;
  isLoading = false;

  constructor(private platform: Platform,
              private authService: AuthService) {}

  ngOnInit() {
  }

  authenticate(email: string, password:string) {
    if (this.isLogin) {
      this.authService.login(email, password).then((data) => {
        console.log(data);
      }, (err) => {
        console.log(err);
      });
    } else {
      this.authService.signup(email, password).then((data) => {
        console.log(data);
      }, (err) => {
        console.log(err);
      });
    }
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
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
    if (this.platform.is('cordova')) {
      this.authService.nativeGoogleLogin().then((data) => {
        console.log(data);
      }, (err) => {
        console.debug(err);
      })
    }
  }

  async facebookLogin() {
    if (this.platform.is('cordova')) {
      this.authService.nativeFacebookLogin().then((data) => {
        console.log(data);
      }, (err) => {
        console.debug(err);
      });
    }
  }



  // signOut() {
  //   this.afAuth.auth.signOut();
  //   if (this.platform.is('cordova')) {
  //     this.gplus.logout();
  //   }
  // }

}

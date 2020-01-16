import { Injectable } from "@angular/core";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { AngularFireFunctions } from "@angular/fire/functions";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class FcmService {
  public token;

  constructor(private fun: AngularFireFunctions) {}

  public setToken(token: string) {
    this.token = token;
  }

  public sub(topic, token) {
    this.fun
      .httpsCallable("subscribeToTopic")({ topic, token })
      .pipe(tap(_ => console.log(`subscribed to ${topic}`)))
      .subscribe();
  }

  public unsub(topic, token) {
    this.fun
      .httpsCallable("unsubscribeToTopic")({ topic, token })
      .pipe(tap(_ => console.log(`unsubscribed to ${topic}`)))
      .subscribe();
  }
}

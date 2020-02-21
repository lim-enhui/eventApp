import { Pipe, PipeTransform } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { IUser } from "../model/user.interface";
import { Observable } from "rxjs";

@Pipe({ name: "getRecipient" })
export class getRecipientPipe implements PipeTransform {
  constructor(private afs: AngularFirestore) {}
  transform(users: Array<string>, userId?: string): Observable<IUser> {
    let recipientId: string;
    let _users = users.slice();
    let userIndex = _users.findIndex(el => el !== userId);

    _users = _users.splice(userIndex, 1);
    recipientId = _users.pop();

    return this.afs.doc<IUser>(`users/${recipientId}`).valueChanges();
  }
}

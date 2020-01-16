import { Pipe, PipeTransform } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
 */
@Pipe({ name: "getRecipientPhoto" })
export class getRecipientPhotoPipe implements PipeTransform {
  constructor(private afs: AngularFirestore) {}
  transform(users: Array<any>, userId?: string): any {
    let recipientId: string;
    let _users = users.slice();
    let userIndex = _users.findIndex(el => el !== userId);

    _users = _users.splice(userIndex, 1);
    recipientId = _users.pop();
    console.log("photo", recipientId);
    return this.afs.doc(`users/${recipientId}`).valueChanges();
  }
}

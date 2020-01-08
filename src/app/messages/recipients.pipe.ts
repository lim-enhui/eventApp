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
@Pipe({ name: "getRecipient" })
export class getRecipientPipe implements PipeTransform {
  constructor(private afs: AngularFirestore) {}
  transform(users: Array<any>, userId?: string): any {
    let recipientId: string;
    let userIndex = users.findIndex(el => el !== userId);

    users = users.splice(userIndex, 1);
    recipientId = users.pop();
    return this.afs.doc(`users/${recipientId}`).valueChanges();
  }
}

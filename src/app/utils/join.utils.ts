import { AngularFirestore } from "@angular/fire/firestore";
import { defer, of, combineLatest } from "rxjs";
import { map, switchMap, mergeMap, exhaustMap } from "rxjs/operators";
import * as _ from "lodash";

export const itemsJoin = (afs: AngularFirestore) => {
  return source =>
    defer(() => {
      return source.pipe(
        switchMap((payload: { items: Array<string> }) => {
          if (Array.isArray(payload.items)) {
            console.log(payload.items);
            let itemDoc$ = [];
            payload.items.forEach(element => {
              itemDoc$.push(
                afs
                  .doc(`item/${element}`)
                  .snapshotChanges()
                  .pipe(
                    map(actions => {
                      const id = actions.payload.id;
                      const data: any = actions.payload.data();
                      return { id, ...data };
                    })
                  )
              );
            });
            return combineLatest(itemDoc$);
          }
          return of(payload);
        })
      );
    });
};

export const messageJoin = (afs: AngularFirestore) => {
  return source =>
    defer(() => {
      let parent;
      let recipients;
      return source.pipe(
        switchMap((payload: any) => {
          console.log(payload);
          parent = payload;
          if (Array.isArray(payload.recipients)) {
            let userDoc$ = [];
            payload.recipients.forEach(uid => {
              userDoc$.push(afs.doc(`users/${uid}`).valueChanges());
            });
            console.log(userDoc$);
            return combineLatest(userDoc$);
          }
        }),
        mergeMap((payload: any) => {
          recipients = payload;
          for (let i = 0; i < parent.chats.length; i++) {
            parent.chats[i].uid = payload.find(({ uid }) => {
              return uid === parent.chats[i].uid;
            });
          }

          let _parent = { ...parent, recipients };
          return of(_parent);
        })
      );
    });
};

export const usersJoin = (afs: AngularFirestore) => {
  return source =>
    defer(() => {
      return source.pipe(
        switchMap((payload: { users: Array<string> }) => {
          if (Array.isArray(payload.users)) {
            console.log(payload.users);
            let userDoc$ = [];
            payload.users.forEach(element => {
              userDoc$.push(
                afs
                  .doc(`users/${element}`)
                  .snapshotChanges()
                  .pipe(
                    map(actions => {
                      const id = actions.payload.id;
                      const data: any = actions.payload.data();
                      return { id, ...data };
                    })
                  )
              );
            });
            return combineLatest(userDoc$);
          }
          return of(payload);
        })
      );
    });
};

export const messagesJoin = (afs: AngularFirestore) => {
  return source =>
    defer(() => {
      let messages;
      let users;
      let parent;
      return source.pipe(
        exhaustMap((payload: any) => {
          parent = payload;
          console.log(payload);
          let messageDoc$ = [];
          if (payload.messages.length !== 0) {
            payload.messages.forEach(element => {
              messageDoc$.push(
                afs
                  .doc(`message/${element}`)
                  .snapshotChanges()
                  .pipe(
                    map(actions => {
                      let id = actions.payload.id;
                      let data: any = actions.payload.data();
                      console.log(id);
                      // console.log(actions.payload.data());
                      return { ...data, id: id };
                    })
                  )
              );
            });
            return combineLatest(messageDoc$);
          } else {
            return of([]);
          }
        }),
        exhaustMap((payload: any) => {
          messages = payload;
          let userDoc$ = [];
          let userArray: Array<any> = [];
          let userSet: Array<any> = [];
          if (payload.length !== 0) {
            for (let i = 0; i < payload.length; i++) {
              if (payload[i].chats.length !== 0) {
                for (let j = 0; j < payload[i].chats.length; j++) {
                  userArray.push(payload[i].chats[j].uid);
                }
              }
            }
          }

          userSet = Array.from(new Set(userArray));

          if (userSet.length !== 0) {
            userSet.forEach(uid => {
              userDoc$.push(afs.doc(`users/${uid}`).valueChanges());
            });

            return combineLatest(userDoc$);
          }
          return of([]);
        }),
        exhaustMap((payload: any) => {
          users = payload;

          if (messages.length != 0) {
            for (let k = 0; k < messages.length; k++) {
              for (let j = 0; j < messages[k].chats.length; j++) {
                messages[k].chats[j].uid = users.find(
                  ({ uid }) => uid === messages[k].chats[j].uid
                );
              }
            }

            for (let i = 0; i < parent.messages.length; i++) {
              console.log(parent.messages[i]);
              parent.messages[i] = messages.find(
                ({ id }) => id === parent.messages[i]
              );
              console.log(parent.messages[i]);
            }
          } else {
            return of([]);
          }

          return of(parent);
        })
      );
    });
};

import { AngularFirestore } from "@angular/fire/firestore";
import { defer, of, combineLatest, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";

export const messagesJoin = (afs: AngularFirestore) => {
  return source =>
    defer(() => {
      let parent;
      let messages;
      let users;
      return source.pipe(
        switchMap(payload => {
          parent = payload;
          if (Array.isArray(payload["messages"])) {
            console.log("messages is array");
            console.log(payload["messages"]);
            let messageDoc$ = [];
            payload["messages"].forEach(element => {
              messageDoc$.push(
                afs
                  .doc(`message/${element}`)
                  .snapshotChanges()
                  .pipe(
                    map(actions => {
                      const id = actions.payload.id;
                      const data = actions.payload.data();
                      return { id, ...data };
                    })
                  )
              );
            });
            return combineLatest(messageDoc$);
          }
          return of(payload);
        }),
        switchMap(payload => {
          messages = payload;
          if (Array.isArray(payload)) {
            console.log("is payload");
            let userArray: Array<any> = [];
            let userDoc$ = [];
            for (let i = 0; i < payload.length; i++) {
              for (let j = 0; j < payload[i]["chats"].length; j++) {
                userArray.push(payload[i]["chats"][j].uid);
              }
            }
            userArray = Array.from(new Set(userArray));

            userArray.forEach(uid => {
              userDoc$.push(afs.doc(`users/${uid}`).valueChanges());
            });
            return combineLatest(userDoc$);
          }
          return of(payload);
        }),
        map(payload => {
          users = payload;
          for (let k = 0; k < messages.length; k++) {
            for (let j = 0; j < messages[k].chats.length; j++) {
              messages[k].chats[j].uid = users.find(
                ({ uid }) => uid === messages[k].chats[j].uid
              );
            }
          }

          for (let i = 0; i < parent["messages"].length; i++) {
            console.log(parent["messages"][i]);
            parent["messages"][i] = messages.find(
              ({ id }) => id === parent["messages"][i]
            );
            console.log(parent["messages"][i]);
          }

          return parent;
        })
      );
    });
};

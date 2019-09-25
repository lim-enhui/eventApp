import { AngularFirestore } from "@angular/fire/firestore";
import { defer, combineLatest, of, Observable, observable } from "rxjs";
import { switchMap, map, tap, shareReplay, mergeMap } from "rxjs/operators";

export const test2JoinDocument = (
  afs: AngularFirestore,
  paths: { [key: string]: string } = { chats: "users" }
) => {
  return source =>
    defer(() => {
      let parent;
      let fullPath;
      const keys = Object.keys(paths);

      return source.pipe(
        switchMap(data => {
          // Save the parent data state
          parent = data;
          console.log("parent");
          console.log(parent);
          // Map each path to an Observable
          const docs$ = keys.map(k => {
            const fullPath = `${paths[k]}/${parent[k]}`;
            return afs.doc(fullPath).valueChanges();
          });

          // return combineLatest, it waits for all reads to finish
          return combineLatest(docs$);
        }),
        map(arr => {
          // We now have all the associated douments
          // Reduce them to a single object based on the parent's keys
          const joins = keys.reduce((acc, cur, idx) => {
            return { ...acc, [cur]: arr[idx] };
          }, {});

          // Return the parent doc with the joined objects
          return { ...parent, ...joins };
        })
      );
    });
};

export const testJoinDocument = (
  afs: AngularFirestore,
  paths: { [key: string]: string }
) => {
  return source =>
    defer(() => {
      let parent;
      const keys = Object.keys(paths);
      console.log(source); //Observables
      return source.pipe(
        switchMap(data => {
          parent = data; // data is store to the parent
          const docs$ = keys.map(k => {
            const fullPath = `${paths[k]}/${parent[k]}`;
            return afs
              .doc(fullPath)
              .valueChanges()
              .pipe(
                test2JoinDocument(afs, paths),
                shareReplay(1)
              );
          });

          // after each key map
          //
          return combineLatest(docs$);
        }),
        map(arr => {
          console.log(arr);
          if (Array.isArray(arr)) {
            arr.forEach(element => {
              for (var key in element) {
                if (element.hasOwnProperty(key)) {
                  console.log(key + " -> " + element[key]);
                  if (element[key] === undefined) {
                    delete element[key];
                  }
                }
              }
            });
          }

          // We now have all the associated douments
          // Reduce them to a single object based on the parent's keys
          const joins = keys.reduce((acc, cur, idx) => {
            return { ...acc, [cur]: arr[idx] };
          }, {});
          console.log(keys);
          console.log(joins);
          // Return the parent doc with the joined objects
          return { ...parent, ...joins };
        })
      );
      // return source.pipe(
      //   switchMap(data => {
      //     // Save the parent data state
      //     parent = data;

      //     // Map each path to an Observable
      //     const docs$ = keys.map(k => {
      //       const fullPath = `${paths[k]}/${parent[k]}`;
      //       return afs.doc(fullPath).valueChanges();
      //     });

      //     // return combineLatest, it waits for all reads to finish
      //     return combineLatest(docs$);
      //   }),
      //   map(arr => {
      //     // We now have all the associated douments
      //     // Reduce them to a single object based on the parent's keys
      //     const joins = keys.reduce((acc, cur, idx) => {
      //       return { ...acc, [cur]: arr[idx] };
      //     }, {});

      //     // Return the parent doc with the joined objects
      //     return { ...parent, ...joins };
      //   })
      // );
    });
};

export const outerJoinDocument = (
  afs: AngularFirestore,
  paths: { [key: string]: string }
) => {
  return source =>
    defer(() => {
      let parent;
      const keys = Object.keys(paths);
      return source.pipe(
        switchMap(data => {
          // Save parent data state
          parent = data;
          console.log("sw1 map", data);
          // Map each path to an Observable
          const doc$ = keys.map(k => {
            let fullPath;
            let pathArr = [];
            if (Array.isArray(parent[k])) {
              for (let i = 0; i < parent[k].length; i++) {
                fullPath = `${paths[k]}/${parent[k][i]}`;
                pathArr.push(
                  afs
                    .doc<{
                      chats: Observable<
                        Array<{
                          content: string;
                          createdAt: number;
                          uid: any;
                        }>
                      >;
                    }>(fullPath)
                    .snapshotChanges()
                    .pipe(
                      map(actions => {
                        const id = actions.payload.id;
                        const data = actions.payload.data();
                        return { id, ...data };
                      }),
                      test2JoinDocument(afs)
                    )
                );
              }
              return pathArr;
            } else {
              fullPath = `${paths[k]}/${parent[k]}`;
              return afs.doc(fullPath).valueChanges();
            }
          });
          //return combineLatest, it waits for all reads to finish
          for (let j = 0; j < doc$.length; j++) {
            if (Array.isArray(doc$[j])) {
              doc$[j] = combineLatest(doc$[j]);
            }
          }
          return combineLatest(doc$);
        }),
        map(arr => {
          // We now have all the associated documents
          // Reduce them to a single object based on the parent's keys
          const joins = keys.reduce((acc, cur, idx) => {
            return { ...acc, [cur]: arr[idx] };
          }, {});

          // Return the parent doc with the joined objects
          return { ...parent, ...joins };
        })
      );
    });
};

export const leftJoinCollection = (
  afs: AngularFirestore,
  field,
  collection,
  limit = 100
) => {
  return source =>
    defer(() => {
      // Operator state
      let collectionData;

      // Track total num of joined doc reads
      let totalJoins = 0;

      return source.pipe(
        switchMap(data => {
          // Clear mapping on each emitted val

          // Save the parent data state
          collectionData = data as any[];

          const read$ = [];
          for (const doc of collectionData) {
            // Push doc of collectionData

            if (doc[field]) {
              // Perform query on join key, with optional limit
              const q = ref => ref.where(field, "==", doc[field]).limit(limit);

              read$.push(afs.collection(collection, q).valueChanges());
            } else {
              read$.push(of([]));
            }
          }
          return combineLatest(read$);
        }),
        map(joins => {
          return collectionData.map((v, i) => {
            totalJoins += joins[i].length;
            return { ...v, [collection]: joins[i] || null };
          });
        }),
        tap(final => {
          console.log(
            `Queried ${(final as any).length}, Joined ${totalJoins} docs`
          );
          totalJoins = 0;
        })
      );
    });
};

export const leftJoinDocument = (afs: AngularFirestore, field, collection) => {
  return source =>
    defer(() => {
      // Operator state
      let collectionData;
      const cache = new Map();

      return source.pipe(
        switchMap(data => {
          // Clear mapping on each emitted val;
          cache.clear();

          // Save the parent data state
          collectionData = data as any[];
          console.log("collectionData", collectionData);
          const reads$ = [];

          let i = 0;
          for (const doc of collectionData) {
            // Skip if doc field does not exist or is already in cache
            if (!doc[field] || cache.get(doc[field])) {
              continue;
            }

            // Push doc read to Array
            reads$.push(
              afs
                .collection(collection)
                .doc(doc[field])
                .valueChanges()
            );

            console.log("field ", field);
            console.log("doc[field] ", doc[field]);

            cache.set(doc[field], i);
            i++;
          }
          console.log("reads$ ", reads$);
          return reads$.length ? combineLatest(reads$) : of([]);
        }),
        map(joins => {
          console.log("joins ", joins);
          console.log("collectionData", collectionData);
          return collectionData.map((v, i) => {
            const joinIdx = cache.get(v[field]);
            return { ...v, [field]: joins[joinIdx] || null };
          });
        }),
        tap(final => {
          console.log(
            `Queried ${(final as any).length}, Joined ${cache.size} docs`
          );
          console.log("final ", final);
        })
      );
    });
};

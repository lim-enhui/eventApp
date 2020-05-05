import * as tslib_1 from "tslib";
import { defer, of, combineLatest } from "rxjs";
import { map, switchMap, mergeMap, exhaustMap } from "rxjs/operators";
export var itemsJoin = function (afs) {
    return function (source) {
        return defer(function () {
            return source.pipe(switchMap(function (payload) {
                if (Array.isArray(payload.items)) {
                    console.log(payload.items);
                    var itemDoc$_1 = [];
                    payload.items.forEach(function (element) {
                        itemDoc$_1.push(afs
                            .doc("item/" + element)
                            .snapshotChanges()
                            .pipe(map(function (actions) {
                            var id = actions.payload.id;
                            var data = actions.payload.data();
                            return tslib_1.__assign({ id: id }, data);
                        })));
                    });
                    return combineLatest(itemDoc$_1);
                }
                return of(payload);
            }));
        });
    };
};
export var messageJoin = function (afs) {
    return function (source) {
        return defer(function () {
            var parent;
            var recipients;
            return source.pipe(switchMap(function (payload) {
                console.log(payload);
                parent = payload;
                if (Array.isArray(payload.recipients)) {
                    var userDoc$_1 = [];
                    payload.recipients.forEach(function (uid) {
                        userDoc$_1.push(afs.doc("users/" + uid).valueChanges());
                    });
                    console.log(userDoc$_1);
                    return combineLatest(userDoc$_1);
                }
            }), mergeMap(function (payload) {
                recipients = payload;
                var _loop_1 = function (i) {
                    parent.chats[i].uid = payload.find(function (_a) {
                        var uid = _a.uid;
                        return uid === parent.chats[i].uid;
                    });
                };
                for (var i = 0; i < parent.chats.length; i++) {
                    _loop_1(i);
                }
                var _parent = tslib_1.__assign({}, parent, { recipients: recipients });
                return of(_parent);
            }));
        });
    };
};
export var usersJoin = function (afs) {
    return function (source) {
        return defer(function () {
            return source.pipe(switchMap(function (payload) {
                if (Array.isArray(payload.users)) {
                    console.log(payload.users);
                    var userDoc$_2 = [];
                    payload.users.forEach(function (element) {
                        userDoc$_2.push(afs
                            .doc("users/" + element)
                            .snapshotChanges()
                            .pipe(map(function (actions) {
                            var id = actions.payload.id;
                            var data = actions.payload.data();
                            return tslib_1.__assign({ id: id }, data);
                        })));
                    });
                    return combineLatest(userDoc$_2);
                }
                return of(payload);
            }));
        });
    };
};
export var messagesJoin = function (afs) {
    return function (source) {
        return defer(function () {
            var messages;
            var users;
            var parent;
            return source.pipe(exhaustMap(function (payload) {
                parent = payload;
                console.log(payload);
                var messageDoc$ = [];
                if (payload.messages.length !== 0) {
                    payload.messages.forEach(function (element) {
                        messageDoc$.push(afs
                            .doc("message/" + element)
                            .snapshotChanges()
                            .pipe(map(function (actions) {
                            var id = actions.payload.id;
                            var data = actions.payload.data();
                            console.log(id);
                            // console.log(actions.payload.data());
                            return tslib_1.__assign({}, data, { id: id });
                        })));
                    });
                    return combineLatest(messageDoc$);
                }
                else {
                    return of([]);
                }
            }), exhaustMap(function (payload) {
                messages = payload;
                var userDoc$ = [];
                var userArray = [];
                var userSet = [];
                if (payload.length !== 0) {
                    for (var i = 0; i < payload.length; i++) {
                        if (payload[i].chats.length !== 0) {
                            for (var j = 0; j < payload[i].chats.length; j++) {
                                userArray.push(payload[i].chats[j].uid);
                            }
                        }
                    }
                }
                userSet = Array.from(new Set(userArray));
                if (userSet.length !== 0) {
                    userSet.forEach(function (uid) {
                        userDoc$.push(afs.doc("users/" + uid).valueChanges());
                    });
                    return combineLatest(userDoc$);
                }
                return of([]);
            }), exhaustMap(function (payload) {
                users = payload;
                if (messages.length != 0) {
                    var _loop_2 = function (k) {
                        var _loop_4 = function (j) {
                            messages[k].chats[j].uid = users.find(function (_a) {
                                var uid = _a.uid;
                                return uid === messages[k].chats[j].uid;
                            });
                        };
                        for (var j = 0; j < messages[k].chats.length; j++) {
                            _loop_4(j);
                        }
                    };
                    for (var k = 0; k < messages.length; k++) {
                        _loop_2(k);
                    }
                    var _loop_3 = function (i) {
                        console.log(parent.messages[i]);
                        parent.messages[i] = messages.find(function (_a) {
                            var id = _a.id;
                            return id === parent.messages[i];
                        });
                        console.log(parent.messages[i]);
                    };
                    for (var i = 0; i < parent.messages.length; i++) {
                        _loop_3(i);
                    }
                }
                else {
                    return of([]);
                }
                return of(parent);
            }));
        });
    };
};
export var eventsJoin = function (afs) {
    return function (source) {
        return defer(function () {
            return source.pipe(switchMap(function (payload) {
                console.log(payload.createdevents);
                var eventsDoc$ = [];
                if (Array.isArray(payload.createdevents) &&
                    payload.createdevents.length > 0) {
                    payload.createdevents.forEach(function (element) {
                        eventsDoc$.push(afs
                            .doc("events/" + element)
                            .snapshotChanges()
                            .pipe(map(function (actions) {
                            var id = actions.payload.id;
                            var data = actions.payload.data();
                            return tslib_1.__assign({ id: id }, data);
                        })));
                    });
                    return combineLatest(eventsDoc$);
                }
                return of([]);
            }));
        });
    };
};
//# sourceMappingURL=join.utils.js.map
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const subscribeToTopic = functions.https.onCall(
  async (data, context) => {
    await admin.messaging().subscribeToTopic(data.token, data.topic);

    return `subscribed to ${data.topic}`;
  }
);

export const unsubsribeFromTopic = functions.https.onCall(
  async (data, context) => {
    await admin.messaging().unsubscribeFromTopic(data.token, data.topic);

    return `unsubscribed from ${data.topic}`;
  }
);

export const sendOnFirestoreCreate = functions.firestore
  .document("events/{eventId}")
  .onCreate(async snapshot => {
    const event: any = snapshot.data();

    const notification: admin.messaging.Notification = {
      title: `New Event ${event.eventname} Published`,
      body: event.eventaddress
    };

    const payload: admin.messaging.Message = {
      notification,
      webpush: {
        notification: {
          vibrate: [200, 100, 200]
        }
      },
      topic: "events"
    };

    return admin.messaging().send(payload);
  });

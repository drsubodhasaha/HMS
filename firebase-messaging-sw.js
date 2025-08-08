importScripts(
  "https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js"
);
const firebaseConfig = {
  apiKey: "AIzaSyBfOOTFSilI78LLb9gb9ucHDueXUC5lGOQ",
  authDomain: "hospitalmanagement-omniworks.firebaseapp.com",
  projectId: "hospitalmanagement-omniworks",
  storageBucket: "hospitalmanagement-omniworks.appspot.com",
  messagingSenderId: "195207499224",
  appId: "1:195207499224:web:d9fcd970f76851bcaeb6ad",
  measurementId: "G-3SG3L2K050",
};
const DB_NAME = "fcm-messages-db";
const DB_VERSION = 2;
const STORE_NAME = "messages";
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging.isSupported()
  ? firebase.messaging(app)
  : null;
console.log("firebase support", firebase.messaging.isSupported());
// self.addEventListener("install", (event) => {
//   initDB()
//     .then((res) => {
//       console.log({ res });
//     })
//     .catch((e) => console.log(e));
// });
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  console.log({ event });
  event.waitUntil(
    clients.openWindow(
      event.notification?.data?.path || "https://hms.omniworks.io"
    )
  );
});

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon:
      payload.notification?.image ||
      "https://firebasestorage.googleapis.com/v0/b/hospitalmanagement-omniworks.appspot.com/o/hms_logo.png?alt=media&token=73c285f9-88ae-4588-831e-e7b5bbfdd6c5",
    data: payload.data,
    actions: payload.notification.actions,
  };
  addData(payload)
    .then((res) => {
      return self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    })
    .catch((err) => console.log(err));
});

const addData = (data) => {
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = () => {
      const localforage = request.result;
      const tx = localforage.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.add({ value: data });
      // console.log("request.onsuccess - addData", data);
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve("Unknown error");
      }
    };
  });
};

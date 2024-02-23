// firebase.js
import * as firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  api_key: [
    {
      current_key: "AIzaSyClO-bMamIPpPchysiC1vspKCRlZ6gJtnA",
    },
  ],
  authDomain: "compound-interest.firebaseapp.com",
  projectId: "compound-interest-6e9e8",
  storageBucket: "compound-interest-6e9e8.appspot.com",
  messagingSenderId: "97251032785",
  appId: "1:97251032785:android:1e6b7f0765acb19e088ff0",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;

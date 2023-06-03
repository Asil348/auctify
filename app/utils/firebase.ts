// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYTwE6B5Y0FdMd5OpuJVjUIeqdf4ILXtk",
  authDomain: "auction-site-ad94e.firebaseapp.com",
  projectId: "auction-site-ad94e",
  storageBucket: "auction-site-ad94e.appspot.com",
  messagingSenderId: "384024186715",
  appId: "1:384024186715:web:07aea3fb1072cb39bd547e",
  measurementId: "G-8MC6MBKGN9",
};

const firebaseApp = initializeApp(firebaseConfig);
export const clientDB = getFirestore(firebaseApp);

// const analytics = getAnalytics(app);

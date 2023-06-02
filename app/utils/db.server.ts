// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import admin from "firebase-admin";
import {
  applicationDefault,
  initializeApp as initializeAdminApp,
} from "firebase-admin/app";
// import { getAnalytics } from "firebase/analytics";
require("dotenv").config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

if (!admin.apps.length) {
  initializeAdminApp({
    credential: applicationDefault(),
    databaseURL: "https://auction-site-ad94e.firebaseio.com",
  });
}

let Firebase;

//@ts-ignore
if (!Firebase?.apps?.length) {
  Firebase = initializeApp(firebaseConfig);
}

export const db = admin.firestore();

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

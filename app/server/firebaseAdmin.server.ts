// Import the functions you need from the SDKs you need
import admin from "firebase-admin";
import {
  applicationDefault,
  initializeApp as initializeAdminApp,
} from "firebase-admin/app";
require("dotenv").config();

if (!admin.apps.length) {
  initializeAdminApp({
    credential: applicationDefault(),
    databaseURL: "https://auction-site-ad94e.firebaseio.com",
  });
}

export const adminDB = admin.firestore();

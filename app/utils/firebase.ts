// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import config from "../../firebaseConfig.json"
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = config;

const firebaseApp = initializeApp(firebaseConfig);
export const clientDB = getFirestore(firebaseApp);

// const analytics = getAnalytics(app);

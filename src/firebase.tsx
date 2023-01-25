import { initializeApp } from "firebase/app";
require("dotenv").config();

// console.log(process.env);

const firebaseConfig = {
  apiKey: process.env.SOCIAL_APP_API_KEY,
  authDomain: process.env.SOCIAL_APP_AUTHDOMAIN,
  projectId: process.env.SOCIAL_APP_PROJECTID,
  storageBucket: process.env.SOCIAL_APP_STORAGEBUCKET,
  messagingSenderId: process.env.SOCIAL_APP_MESSAGINGSENDERID,
  appId: process.env.SOCIAL_APP_APPID,
  measurementId: process.env.SOCIAL_APP_MEASUREMENTID,
};

export const app = initializeApp(firebaseConfig);

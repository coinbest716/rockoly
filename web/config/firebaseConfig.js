import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const {
  FIREBASE_API_KEY,
  AUTHDOMAIN,
  DATABASEURL,
  PROJECTID,
  MESSAGINGSENDERID,
  APPID,
} = publicRuntimeConfig;

const config = {
  apiKey: FIREBASE_API_KEY,
  authDomain: AUTHDOMAIN,
  databaseURL: DATABASEURL,
  projectId: PROJECTID,
  storageBucket: 'rockoly-dev.appspot.com',
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
};

const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(config);

const auth = firebase.auth();
const firestore = firebase.firestore();

export { firebase, app, auth, firestore };

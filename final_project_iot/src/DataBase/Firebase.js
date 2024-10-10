

import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

// Configuración de Firebase obtenida desde Firebase Console VERDADERA
const firebaseConfig = {
  apiKey: "AIzaSyBOfIqbZgEbcuxSKJanTWM4nZpvPrndryU",
  authDomain: "hospitalobreroiot.firebaseapp.com",
  projectId: "hospitalobreroiot",
  storageBucket: "hospitalobreroiot.appspot.com",
  messagingSenderId: "377682171639",
  appId: "1:377682171639:web:46de8b1f40450dc8e665f2",
  measurementId: "G-25JYQCL3VM"
};

// Inicializar Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;


//////////////////////////
/*import { initializeApp } from 'firebase/app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; // Importar Firestore
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase obtenida desde Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBOfIqbZgEbcuxSKJanTWM4nZpvPrndryU",
  authDomain: "hospitalobreroiot.firebaseapp.com",
  projectId: "hospitalobreroiot",
  storageBucket: "hospitalobreroiot.appspot.com",
  messagingSenderId: "377682171639",
  appId: "1:377682171639:web:46de8b1f40450dc8e665f2",
  measurementId: "G-25JYQCL3VM"
};

// Inicializar Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Inicializar Firestore

const app = initializeApp(firebaseConfig);

export const db= getFirestore(app);
*/
//////////////////////FIRESTORE
/*
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; // Importar Firestore

// Configuración de Firebase obtenida desde Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBOfIqbZgEbcuxSKJanTWM4nZpvPrndryU",
  authDomain: "hospitalobreroiot.firebaseapp.com",
  projectId: "hospitalobreroiot",
  storageBucket: "hospitalobreroiot.appspot.com",
  messagingSenderId: "377682171639",
  appId: "1:377682171639:web:46de8b1f40450dc8e665f2",
  measurementId: "G-25JYQCL3VM"
};

// Inicializar Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Inicializar Firestore
const firestore = firebase.firestore();

export default firestore;
*/
////////////////////////////////////////////

// src/Database/Firebase.js
// src/Database/Firebase.js
/*
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID",
  measurementId: "TU_MEASUREMENT_ID"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

export default { db };

*/
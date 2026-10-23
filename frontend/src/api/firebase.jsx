// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getDatabase, ref, set, onValue, push, remove, update } from 'firebase/database';

// // Firebase config object
// const firebaseConfig = {
//   apiKey: "AIzaSyD7Q80UzBdfnKLA7NX35K_vJSxqqXczr-U",
//   authDomain: "farmers-connect-15bad.firebaseapp.com",
//   projectId: "farmers-connect-15bad",
//   storageBucket: "farmers-connect-15bad.firebasestorage.app",
//   messagingSenderId: "998807400867",
//   appId: "1:998807400867:web:698f9e7354b53ccdf9aa16",
//   measurementId: "G-WD77JJB83W",
//   databaseURL: "https://farmers-connect-15bad-default-rtdb.firebaseio.com"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const googleProvider = new GoogleAuthProvider();
// const db = getDatabase(app);

// export { auth, googleProvider, db, ref, set, onValue, push, remove, update };

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, onValue, push, remove, update } from 'firebase/database';

// Firebase configuration for FarmConnect
const firebaseConfig = {
  apiKey: "AIzaSyBK6-c__uXjPaM7YoU-nREX3N74ZSa7cAo",
  authDomain: "farmconnect-9a44b.firebaseapp.com",
  projectId: "farmconnect-9a44b",
  storageBucket: "farmconnect-9a44b.firebasestorage.app",
  messagingSenderId: "556675438923",
  appId: "1:556675438923:web:12ef345cacd2fe0204f0ce",
  measurementId: "G-7Y0T6SDRXC",
  // Verify your exact database URL in the Firebase Console
  databaseURL: "https://farmconnect-9a44b-default-rtdb.firebaseio.com/" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getDatabase(app);

export { auth, googleProvider, db, ref, set, onValue, push, remove, update };

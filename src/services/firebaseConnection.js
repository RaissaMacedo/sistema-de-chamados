import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCBKpkJprLMMKbtWlJ7cu-6F82_nhmIQ8w',
  authDomain: 'tickets-42548.firebaseapp.com',
  projectId: 'tickets-42548',
  storageBucket: 'tickets-42548.appspot.com',
  messagingSenderId: '783859751171',
  appId: '1:783859751171:web:7365888b01662148727136',
  measurementId: 'G-XWWQMY1S1N',
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };

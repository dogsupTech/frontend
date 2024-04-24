// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBOYTylGxQ4rSV7nx_lTnnVOMYCEwK3pl4",
  authDomain: "striped-orbit-350718.firebaseapp.com",
  projectId: "striped-orbit-350718",
  storageBucket: "striped-orbit-350718.appspot.com",
  messagingSenderId: "915058396542",
  appId: "1:915058396542:web:f4e7f37f7af17f75f2f72f",
  measurementId: "G-H2QNJ67TR7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export {app}

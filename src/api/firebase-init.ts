import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Firebase API configuration
const firebaseConfig = {
    apiKey: "AIzaSyATqLy0OZCU_vuxDatuSm0joMm6Tiip6e0",
    authDomain: "group-rechat.firebaseapp.com",
    projectId: "group-rechat",
    storageBucket: "group-rechat.firebasestorage.app",
    messagingSenderId: "234595918155",
    appId: "1:234595918155:web:fcf7e9714b026bc2fb48ce"
};

// Initialize Firebase services
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseDB = getFirestore(firebaseApp);


export default firebaseApp;
export { firebaseApp, firebaseAuth, firebaseDB };
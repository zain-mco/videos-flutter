import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDRDWT0ZqNr61MxhqXMb3rRn4c-KfbEuoA",
    authDomain: "video-showcase-821bc.firebaseapp.com",
    projectId: "video-showcase-821bc",
    storageBucket: "video-showcase-821bc.firebasestorage.app",
    messagingSenderId: "146883286205",
    appId: "1:146883286205:web:55b6b10df4f1b1fb97d3d4",
    measurementId: "G-4YLEMFF5JV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

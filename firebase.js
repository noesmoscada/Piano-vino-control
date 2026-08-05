import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyDElU_IS5ndsR6e8H66j1GX9RTGVCs5oeU",
authDomain: "ticketera2026-v2.firebaseapp.com",
projectId: "ticketera2026-v2",
storageBucket: "ticketera2026-v2.firebasestorage.app",
messagingSenderId: "159437918344",
appId: "1:159437918344:web:052123faa34938fc4a4f3d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

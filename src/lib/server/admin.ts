import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
    FB_CLIENT_EMAIL,
    FB_PRIVATE_KEY,
    FB_PROJECT_ID,
} from "$env/static/private";
import { auth, firestore, credential, initializeApp } from "firebase-admin";

try {
    initializeApp({
        credential: credential.cert({
            projectId: FB_PROJECT_ID,
            clientEmail: FB_CLIENT_EMAIL,
            privateKey: FB_PRIVATE_KEY,
        }),
    });
} catch (err: any) {
    if (!/already exists/u.test(err.message)) {
        console.error("Firebase Admin Error: ", err.stack);
    }
}

export const adminDB = firestore();
export const adminAuth = auth();

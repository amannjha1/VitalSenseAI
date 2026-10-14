/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChzIqIYRJQS0WPHInDeCQ0VB2XfSUB_iE",
  authDomain: "vitalsenseai-d2a8f.firebaseapp.com",
  projectId: "vitalsenseai-d2a8f",
  storageBucket: "vitalsenseai-d2a8f.firebasestorage.app",
  messagingSenderId: "558475532430",
  appId: "1:558475532430:web:0f2ffc17077778e4cd51df",
  measurementId: "G-BXT4LQZHJQ"
};

// Initialize Firebase (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics not supported or blocked in current environment
    });
}

const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

export { app, analytics, db, auth, firebaseConfig };
export default app;

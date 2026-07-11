"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

const AuthContext = createContext({ user: null, loading: true, ageVerified: false });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ageVerified, setAgeVerified] = useState(false);

  useEffect(() => {
    // Check localStorage for age verification to avoid asking every time on this device
    const verified = localStorage.getItem("grancolinos_age_verified");
    if (verified === "true") {
      setAgeVerified(true);
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const verifyAge = async () => {
    localStorage.setItem("grancolinos_age_verified", "true");
    setAgeVerified(true);
    
    // Automatically sign in anonymously when they enter the community to give them a session
    if (!auth.currentUser) {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Error signing in anonymously:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, ageVerified, verifyAge }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

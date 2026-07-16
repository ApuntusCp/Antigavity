"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const AuthContext = createContext({ 
  user: null, 
  loading: true, 
  login: async () => {}, 
  register: async () => {}, 
  logout: async () => {} 
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Si el usuario es anónimo (de la versión anterior), cerramos su sesión para forzar el registro/login
      if (currentUser && currentUser.isAnonymous) {
        signOut(auth).then(() => {
          setUser(null);
          setLoading(false);
        });
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

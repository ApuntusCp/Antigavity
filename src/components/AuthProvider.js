"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// ── Admin emails con acceso bypass al mantenimiento ──────────────────────────
const ADMIN_EMAILS = [
  'brayan.aponte1502@gmail.com',
];

// ── Helpers de cookie de bypass para el proxy server-side ────────────────────
function setAdminBypassCookie() {
  document.cookie = 'gc_admin_bypass=1; path=/; max-age=86400; SameSite=Lax';
}
function clearAdminBypassCookie() {
  document.cookie = 'gc_admin_bypass=; path=/; max-age=0; SameSite=Lax';
}

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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Si el usuario es anónimo (de la versión anterior), cerramos su sesión para forzar el registro/login
      if (currentUser && currentUser.isAnonymous) {
        signOut(auth).then(() => {
          setUser(null);
          setLoading(false);
        });
      } else if (currentUser) {
        // ── try-catch-finally garantiza que setLoading(false) siempre se ejecute
        // Antes: si Firestore fallaba, la app quedaba congelada en loading para siempre
        try {
          const userDocRef = doc(db, 'clients', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          let customData = {};
          if (userDocSnap.exists()) {
            customData = userDocSnap.data();
          } else {
            // Si no existe, inicializar con rangos básicos de Gamificación
            customData = {
              email: currentUser.email,
              ecoPoints: 0,
              vipLevel: 'Bronce',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, customData);
          }

          // Attach custom data to currentUser object for the app to consume
          currentUser.customProfile = customData;
          setUser(currentUser);

          // ── Cookie de bypass para el proxy de mantenimiento ────────────
          // Si es admin, el proxy server-side lo deja pasar sin verificar Firestore
          const isAdmin =
            ADMIN_EMAILS.includes(currentUser.email) ||
            customData?.role === 'admin' ||
            customData?.isAdmin === true;
          if (isAdmin) setAdminBypassCookie();
          else clearAdminBypassCookie();
        } catch (error) {
          console.error('[AuthProvider] Error al cargar perfil de usuario:', error);
          // Aun así asignamos el usuario base para que la app no quede bloqueada
          setUser(currentUser);
          // Si el email es admin, aplicar bypass aunque Firestore haya fallado
          if (ADMIN_EMAILS.includes(currentUser.email)) setAdminBypassCookie();
          else clearAdminBypassCookie();
        } finally {
          setLoading(false);
        }
      } else {
        // Logout: limpiar cookie de bypass
        clearAdminBypassCookie();
        setUser(null);
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
    clearAdminBypassCookie();
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/api/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as fbUpdateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getUser, createUserDoc, updateUserProfile } from "@/api/user.api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch Firestore user
        const firestoreUser = await getUser(firebaseUser.uid);

        // Set global user state
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          ...firestoreUser,
        });
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);

    return {
      id: res.user.uid,
      name: res.user.displayName,
      email: res.user.email,
      avatar: res.user.photoURL,
    };
  };

  const register = async (name, email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    await fbUpdateProfile(res.user, {
      displayName: name,
    });

    await createUserDoc(res.user);

    return res.user;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);

    await createUserDoc(res.user); // safe to call (can check inside)

    return res.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfile = async (updates) => {
    if (!auth.currentUser) return;

    try {
      await fbUpdateProfile(auth.currentUser, updates);
      const result = await updateUserProfile(updates);
      console.log(result);
      return result;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

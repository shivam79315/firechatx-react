import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  getDocs,
} from "firebase/firestore";
import { auth } from "@/api/firebase";

export const createUserDoc = async (user) => {
  try {
    console.log("Creating user doc for:", user.uid);

    const userRef = doc(db, "users", user.uid);

    const userData = {
      uid: user.uid,
      name: user.displayName || "User",
      email: user.email,
      avatar: user.photoURL || null,
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
    };

    await setDoc(userRef, userData);

    console.log("User doc created!");
  } catch (error) {
    console.error("Error creating user doc:", error);
  }
};

export const getUser = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUser = async (uid, updates) => {
  const userRef = doc(db, "users", uid);
  console.log("Updating user doc for:", uid, "with updates:", updates);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const updateUserProfile = async (updates) => {
  if (!auth.currentUser) return;

  // Update Firestore (full profile)
  const result = await updateDoc(doc(db, "users", auth.currentUser.uid), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
  return result;
};

export const updateLastSeen = async (uid) => {
  await updateDoc(doc(db, "users", uid), {
    lastSeen: serverTimestamp(),
  });
};

// user related functions like getUser, updateUser, etc. can be added here as needed
export const searchUsers = async (searchTerm) => {
  if (!searchTerm) return [];

  const userRef = doc(db, "users");

  const q = query(
    userRef,
    where("name", ">=", searchTerm),
    where("name", "<=", searchTerm + "\uf8ff")
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
};
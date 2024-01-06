import React, { useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase';
import { updateEmail, updatePassword, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
  
  const [currentUser, setCurrentUser ]= useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function logout() {
    return signOut(auth);
  }
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }
  function updtEmail(email) {
    return updateEmail(currentUser, email);
  }
  function updtPassword(password) {
    return updatePassword(currentUser, password)
  }
  function updateProfile(name, phone, school, docExists) {
    console.log("name, phone, school", name, phone, school);
    console.log("currentUser", currentUser);

    const docData = {
      name : name,
      school : school,
      phone : phone
      };

      if (docExists){
        return updateDoc(doc(db, "userProfile", currentUser.uid), docData);
      } else {
        return setDoc(doc(db, "userProfile", currentUser.uid), docData);
      }
      
  //   const docData = {
  //     stringExample: "Hello world!",
  //     booleanExample: true,
  //     numberExample: 3.14159265,
  //     dateExample: Timestamp.fromDate(new Date("December 10, 1815")),
  //     arrayExample: [5, true, "hello"],
  //     nullExample: null,
  //     objectExample: {
  //         a: 5,
  //         b: {
  //             nested: "foo"
  //         }
  //     }
  // };
  // return setDoc(doc(db, "data", "one"), docData);
  }
  function updateGameStat(nPlayed, nWon, currentStreak, maxStreak, g1, g2, g3, g4, g5, docExists, uid) {
    console.log("in updateGameStat", nPlayed, nWon, currentStreak, maxStreak);
    //console.log("currentUser", currentUser);

    const docData = {
      nPlayed : nPlayed,
      nWon : nWon,
      currentStreak : currentStreak,
      maxStreak : maxStreak,
      g1 : g1,
      g2 : g2,
      g3 : g3,
      g4 : g4,
      g5 : g5
    };
      
      if (docExists){
        return updateDoc(doc(db, "userGameStat", uid), docData);
      } else {
        return setDoc(doc(db, "userGameStat", uid), docData);
      }
      
  //   const docData = {
  //     stringExample: "Hello world!",
  //     booleanExample: true,
  //     numberExample: 3.14159265,
  //     dateExample: Timestamp.fromDate(new Date("December 10, 1815")),
  //     arrayExample: [5, true, "hello"],
  //     nullExample: null,
  //     objectExample: {
  //         a: 5,
  //         b: {
  //             nested: "foo"
  //         }
  //     }
  // };
  // return setDoc(doc(db, "data", "one"), docData);
  }
  async function fetchUser() {
    const docRef = doc(db, "userProfile", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }

    //return getDoc(docRef);

    // if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data());
    //   return docSnap.data();
    // } else {
    //   // docSnap.data() will be undefined in this case
    //   console.log("No such document!");
    // }
  }

  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user);
        setLoading(false);
      });
    return unsubscribe;
  }, [])
  

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updtEmail,
    updtPassword,
    updateProfile,
    updateGameStat,
    fetchUser
  }
  return (
    <AuthContext.Provider value={value}>
     {!loading && children} 
    </AuthContext.Provider>
  )
}

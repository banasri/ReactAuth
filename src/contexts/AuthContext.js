import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase';
import { updateEmail, updatePassword, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail} from "firebase/auth";
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
    updtPassword
  }
  return (
    <AuthContext.Provider value={value}>
     {!loading && children} 
    </AuthContext.Provider>
  )
}

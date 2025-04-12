import { createContext, useState } from "react";
import auth from "../firebase/firebase.config";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const unsubscribe = () => {
    const unsubscribe = onAuthStateChanged(auth,(currentUser) => {
      
        setUser(currentUser);
        if (currentUser) {
          console.log("User logged in:", currentUser);
        } else {
          console.log("No user logged in");
        }
        
      setLoading(false);
    });
    return () => unsubscribe();
  };
  unsubscribe();
  const authInfo = {
    createUser,
    user,
    setUser,
    loading,
    setLoading,
    signIn
  };

  return (
    <div>
      <AuthContext.Provider value={authInfo}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
